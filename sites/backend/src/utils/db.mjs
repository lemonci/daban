import { DatabaseSync } from 'node:sqlite'
import { randomUUID } from 'node:crypto'

/*
 * Maps Prisma client model names (camelCase) to actual SQLite table names (PascalCase)
 */
const TABLE_MAP = {
  user: 'User',
  apikey: 'Apikey',
  bookmark: 'Bookmark',
  confirmation: 'Confirmation',
  subscriber: 'Subscriber',
  pattern: 'Pattern',
  set: 'Set',
  curatedSet: 'CuratedSet',
  optionPack: 'OptionPack',
}

/*
 * Models where the primary key is a UUID string (not auto-increment integer)
 */
const UUID_PK_MODELS = new Set(['apikey', 'confirmation', 'subscriber'])

/*
 * Boolean fields per table - SQLite stores as 0/1, we convert to/from JS booleans
 */
const BOOL_FIELDS = {
  User: new Set(['compare', 'imperial', 'mfaEnabled', 'newsletter']),
  Pattern: new Set(['public']),
  Set: new Set(['imperial', 'public']),
  Subscriber: new Set(['active']),
  CuratedSet: new Set(['published']),
}

/*
 * Tables that have a createdAt column
 */
const HAS_CREATED_AT = new Set([
  'User',
  'Pattern',
  'Set',
  'Apikey',
  'Confirmation',
  'Subscriber',
  'CuratedSet',
  'OptionPack',
])

/*
 * Tables that have an updatedAt column (Prisma @updatedAt - auto-set on every update)
 */
const HAS_UPDATED_AT = new Set(['User', 'Pattern', 'Set', 'Subscriber', 'CuratedSet', 'OptionPack'])

/*
 * Relation config for include support in findUnique/update.
 * Two relation types:
 *   has-many  (fk)       — query related table WHERE fk = row.id  → returns array
 *   belongs-to (localKey) — query related table WHERE id = row[localKey] → returns single row
 */
const RELATIONS = {
  user: {
    apikeys: { table: 'Apikey', fk: 'userId' },
    bookmarks: { table: 'Bookmark', fk: 'userId' },
    patterns: { table: 'Pattern', fk: 'userId' },
    sets: { table: 'Set', fk: 'userId' },
    confirmations: { table: 'Confirmation', fk: 'userId' },
  },
  confirmation: {
    user: { table: 'User', localKey: 'userId' },
  },
  apikey: {
    user: { table: 'User', localKey: 'userId' },
  },
  pattern: {
    user: { table: 'User', localKey: 'userId' },
  },
  set: {
    user: { table: 'User', localKey: 'userId' },
  },
  bookmark: {
    user: { table: 'User', localKey: 'userId' },
  },
}

/*
 * Convert a raw SQLite row to proper JavaScript types
 * Handles boolean 0/1 -> true/false conversion per table
 */
function convertRow(tableName, row) {
  if (!row) return null
  const result = { ...row }
  const bools = BOOL_FIELDS[tableName]
  if (bools) {
    for (const field of bools) {
      if (field in result && result[field] !== null) {
        result[field] = result[field] === 1 || result[field] === true
      }
    }
  }
  return result
}

/*
 * Convert a JavaScript value to a SQLite-compatible value for writing
 */
function toSqlValue(val) {
  if (val === null || val === undefined) return null
  if (typeof val === 'boolean') return val ? 1 : 0
  if (val instanceof Date) return val.toISOString()
  return val
}

/*
 * Build a WHERE clause from a Prisma-style where object
 * Supports: simple equality, null checks, OR arrays, and operators (contains, equals, in)
 * Returns { sql, params }
 */
function buildWhere(where) {
  const parts = []
  const params = []

  for (const [key, val] of Object.entries(where)) {
    if (key === 'OR') {
      const orParts = []
      for (const cond of val) {
        const { sql, params: p } = buildWhere(cond)
        orParts.push(`(${sql})`)
        params.push(...p)
      }
      parts.push(`(${orParts.join(' OR ')})`)
    } else if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
      // Operator object: { contains: 'foo' }, { equals: 'bar' }, { in: [...] }
      for (const [op, opVal] of Object.entries(val)) {
        if (op === 'contains') {
          parts.push(`"${key}" LIKE ?`)
          params.push(`%${opVal}%`)
        } else if (op === 'equals') {
          parts.push(`"${key}" = ?`)
          params.push(toSqlValue(opVal))
        } else if (op === 'in') {
          const placeholders = opVal.map(() => '?').join(', ')
          parts.push(`"${key}" IN (${placeholders})`)
          params.push(...opVal.map(toSqlValue))
        }
      }
    } else if (val === null) {
      parts.push(`"${key}" IS NULL`)
    } else {
      parts.push(`"${key}" = ?`)
      params.push(toSqlValue(val))
    }
  }

  return {
    sql: parts.length > 0 ? parts.join(' AND ') : '1=1',
    params,
  }
}

/*
 * Build an ORDER BY clause from a Prisma-style orderBy value
 * Accepts either a single object { field: 'asc'|'desc' } or an array of such objects
 */
function buildOrderBy(orderBy) {
  if (!orderBy) return ''
  const entries = Array.isArray(orderBy) ? orderBy : [orderBy]
  const clauses = []
  for (const entry of entries) {
    for (const [field, dir] of Object.entries(entry)) {
      const safeDir = dir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
      clauses.push(`"${field}" ${safeDir}`)
    }
  }
  return clauses.length > 0 ? `ORDER BY ${clauses.join(', ')}` : ''
}

/*
 * Load related records for the include option.
 * Handles both has-many (fk) and belongs-to (localKey) relations.
 */
function loadIncludes(db, modelName, row, include) {
  if (!include || Object.keys(include).length === 0) return row
  const modelRelations = RELATIONS[modelName] || {}
  for (const [rel, shouldInclude] of Object.entries(include)) {
    if (!shouldInclude) continue
    const relConfig = modelRelations[rel]
    if (!relConfig) continue
    if (relConfig.localKey) {
      // belongs-to: single row WHERE id = row[localKey]
      const relRow = db
        .prepare(`SELECT * FROM "${relConfig.table}" WHERE id = ?`)
        .get(row[relConfig.localKey])
      row[rel] = relRow ? convertRow(relConfig.table, relRow) : null
    } else {
      // has-many: array WHERE fk = row.id
      const relRows = db
        .prepare(`SELECT * FROM "${relConfig.table}" WHERE "${relConfig.fk}" = ?`)
        .all(row.id)
      row[rel] = relRows.map((r) => convertRow(relConfig.table, r))
    }
  }
  return row
}

/*
 * Create a Prisma-like model proxy for a given model name
 * All methods are synchronous (DatabaseSync) but work transparently with await
 */
function createModelProxy(db, modelName) {
  const tableName = TABLE_MAP[modelName]
  if (!tableName) {
    // Unknown model (e.g. 'flow', 'admin') - return empty object to avoid errors
    return {}
  }

  return {
    findUnique({ where, include = {} } = {}) {
      const { sql, params } = buildWhere(where)
      let row = db.prepare(`SELECT * FROM "${tableName}" WHERE ${sql} LIMIT 1`).get(...params)
      if (!row) return null
      row = convertRow(tableName, row)
      return loadIncludes(db, modelName, row, include)
    },

    findFirst({ where = {} } = {}) {
      const { sql, params } = buildWhere(where)
      const row = db.prepare(`SELECT * FROM "${tableName}" WHERE ${sql} LIMIT 1`).get(...params)
      return row ? convertRow(tableName, row) : null
    },

    findMany({ where = {}, orderBy, take } = {}) {
      let query = `SELECT * FROM "${tableName}"`
      const params = []

      if (Object.keys(where).length > 0) {
        const { sql, params: whereParams } = buildWhere(where)
        query += ` WHERE ${sql}`
        params.push(...whereParams)
      }

      const orderByClause = buildOrderBy(orderBy)
      if (orderByClause) query += ` ${orderByClause}`

      if (take) query += ` LIMIT ${parseInt(take)}`

      return db
        .prepare(query)
        .all(...params)
        .map((r) => convertRow(tableName, r))
    },

    create({ data }) {
      const processedData = {}

      // Generate UUID for models with string primary keys
      if (UUID_PK_MODELS.has(modelName) && !data.id) {
        processedData.id = randomUUID()
      }

      // Copy data with value conversion
      for (const [k, v] of Object.entries(data)) {
        processedData[k] = toSqlValue(v)
      }

      // Auto-set createdAt if not provided
      if (HAS_CREATED_AT.has(tableName) && !processedData.createdAt) {
        processedData.createdAt = new Date().toISOString()
      }

      // Auto-set updatedAt if not provided
      if (HAS_UPDATED_AT.has(tableName) && processedData.updatedAt === undefined) {
        processedData.updatedAt = new Date().toISOString()
      }

      const columns = Object.keys(processedData)
        .map((c) => `"${c}"`)
        .join(', ')
      const placeholders = Object.keys(processedData)
        .map(() => '?')
        .join(', ')
      const values = Object.values(processedData)

      // Use RETURNING * to get the created row in a single statement (SQLite 3.35+)
      const row = db
        .prepare(`INSERT INTO "${tableName}" (${columns}) VALUES (${placeholders}) RETURNING *`)
        .get(...values)

      return convertRow(tableName, row)
    },

    update({ where, data, include = {} }) {
      const processedData = {}
      const atomicExprs = [] // SQL expressions for atomic ops (increment/decrement/etc.)

      for (const [k, v] of Object.entries(data)) {
        // Handle Prisma atomic operators: { increment: N }, { decrement: N }, { multiply: N }, { divide: N }, { set: V }
        if (v !== null && typeof v === 'object' && !(v instanceof Date)) {
          if ('increment' in v) {
            atomicExprs.push(`"${k}" = "${k}" + ${Number(v.increment)}`)
          } else if ('decrement' in v) {
            atomicExprs.push(`"${k}" = "${k}" - ${Number(v.decrement)}`)
          } else if ('multiply' in v) {
            atomicExprs.push(`"${k}" = "${k}" * ${Number(v.multiply)}`)
          } else if ('divide' in v) {
            atomicExprs.push(`"${k}" = "${k}" / ${Number(v.divide)}`)
          } else if ('set' in v) {
            processedData[k] = toSqlValue(v.set)
          }
        } else {
          processedData[k] = toSqlValue(v)
        }
      }

      // Auto-set updatedAt
      if (HAS_UPDATED_AT.has(tableName)) {
        processedData.updatedAt = new Date().toISOString()
      }

      const setClauses = [
        ...Object.keys(processedData).map((k) => `"${k}" = ?`),
        ...atomicExprs,
      ].join(', ')
      const setValues = Object.values(processedData)

      const { sql: whereSql, params: whereParams } = buildWhere(where)
      // Use RETURNING * to get the updated row in a single statement (SQLite 3.35+)
      let row = db
        .prepare(`UPDATE "${tableName}" SET ${setClauses} WHERE ${whereSql} RETURNING *`)
        .get(...setValues, ...whereParams)
      row = convertRow(tableName, row)
      return loadIncludes(db, modelName, row, include)
    },

    delete({ where }) {
      const { sql, params } = buildWhere(where)
      db.prepare(`DELETE FROM "${tableName}" WHERE ${sql}`).run(...params)
    },

    deleteMany({ where = {} } = {}) {
      if (Object.keys(where).length === 0) {
        db.prepare(`DELETE FROM "${tableName}"`).run()
        return
      }
      const { sql, params } = buildWhere(where)
      db.prepare(`DELETE FROM "${tableName}" WHERE ${sql}`).run(...params)
    },

    count({ where = {} } = {}) {
      let query = `SELECT COUNT(*) as cnt FROM "${tableName}"`
      const params = []
      if (Object.keys(where).length > 0) {
        const { sql, params: whereParams } = buildWhere(where)
        query += ` WHERE ${sql}`
        params.push(...whereParams)
      }
      return db.prepare(query).get(...params).cnt
    },

    aggregate({ _sum } = {}) {
      const result = {}
      if (_sum) {
        result._sum = {}
        for (const field of Object.keys(_sum)) {
          const row = db.prepare(`SELECT SUM("${field}") as total FROM "${tableName}"`).get()
          result._sum[field] = row.total || 0
        }
      }
      return result
    },

    groupBy({ by, _count, orderBy } = {}) {
      const byField = Array.isArray(by) ? by[0] : by
      const countField = _count ? Object.keys(_count)[0] : byField

      let query = `SELECT "${byField}", COUNT("${countField}") as _cnt FROM "${tableName}" GROUP BY "${byField}"`

      if (orderBy?._count) {
        const dir = Object.values(orderBy._count)[0]
        const safeDir = dir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
        query += ` ORDER BY _cnt ${safeDir}`
      }

      return db
        .prepare(query)
        .all()
        .map((row) => ({
          [byField]: row[byField],
          _count: { [countField]: row._cnt },
        }))
    },
  }
}

/*
 * Create and return a native SQLite db object with a Prisma-compatible API.
 *
 * @param {string} dbPath - Path to the SQLite database file (without file: prefix)
 * @returns {Proxy} - A proxy object that mimics the Prisma Client API
 */
export function createDb(dbPath) {
  const db = new DatabaseSync(dbPath)
  db.exec('PRAGMA journal_mode=WAL')
  db.exec('PRAGMA foreign_keys=ON')

  return new Proxy(
    {},
    {
      get(_, modelName) {
        return createModelProxy(db, modelName)
      },
    }
  )
}
