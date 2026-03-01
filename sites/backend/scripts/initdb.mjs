/*
 * Creates the FreeSewing backend SQLite database schema using native Node.js SQLite.
 * Replaces the previous `npx prisma db push` workflow.
 *
 * Usage: node scripts/initdb.mjs
 */
import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'node:fs'
import dotenv from 'dotenv'

dotenv.config()

const dbPath = process.env.BACKEND_DB_PATH || './db.sqlite'
console.log(`Initializing database at: ${dbPath}`)

const db = new DatabaseSync(dbPath)
db.exec('PRAGMA foreign_keys=ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS "User" (
    "id"          INTEGER PRIMARY KEY AUTOINCREMENT,
    "bio"         TEXT    NOT NULL DEFAULT '',
    "compare"     BOOLEAN NOT NULL DEFAULT 1,
    "consent"     INTEGER NOT NULL DEFAULT 0,
    "control"     INTEGER NOT NULL DEFAULT 1,
    "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data"        TEXT    NOT NULL DEFAULT '',
    "ehash"       TEXT    NOT NULL UNIQUE,
    "email"       TEXT    NOT NULL DEFAULT '',
    "ihash"       TEXT    NOT NULL DEFAULT '',
    "initial"     TEXT    NOT NULL DEFAULT '',
    "imperial"    BOOLEAN NOT NULL DEFAULT 0,
    "jwtCalls"    INTEGER NOT NULL DEFAULT 0,
    "keyCalls"    INTEGER NOT NULL DEFAULT 0,
    "language"    TEXT    NOT NULL DEFAULT 'en',
    "lastSeen"    DATETIME,
    "lusername"   TEXT    NOT NULL UNIQUE,
    "mfaSecret"   TEXT    NOT NULL DEFAULT '',
    "mfaEnabled"  BOOLEAN NOT NULL DEFAULT 0,
    "newsletter"  BOOLEAN NOT NULL DEFAULT 0,
    "password"    TEXT    NOT NULL DEFAULT '',
    "patron"      INTEGER NOT NULL DEFAULT 0,
    "role"        TEXT    NOT NULL DEFAULT 'user',
    "status"      INTEGER NOT NULL DEFAULT 0,
    "updatedAt"   DATETIME,
    "username"    TEXT    NOT NULL DEFAULT ''
  );

  CREATE INDEX IF NOT EXISTS "User_ihash_idx" ON "User"("ihash");

  CREATE TABLE IF NOT EXISTS "Apikey" (
    "id"        TEXT    PRIMARY KEY,
    "aud"       TEXT    NOT NULL DEFAULT '',
    "calls"     INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "name"      TEXT    NOT NULL DEFAULT '',
    "lastSeen"  DATETIME,
    "level"     INTEGER NOT NULL DEFAULT 0,
    "secret"    TEXT    NOT NULL DEFAULT '',
    "userId"    INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id")
  );

  CREATE TABLE IF NOT EXISTS "Bookmark" (
    "id"     INTEGER PRIMARY KEY AUTOINCREMENT,
    "type"   TEXT NOT NULL DEFAULT '',
    "title"  TEXT NOT NULL DEFAULT '',
    "url"    TEXT NOT NULL DEFAULT '',
    "userId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id")
  );

  CREATE TABLE IF NOT EXISTS "Confirmation" (
    "id"        TEXT    PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data"      TEXT    NOT NULL DEFAULT '',
    "type"      TEXT    NOT NULL DEFAULT '',
    "userId"    INTEGER,
    FOREIGN KEY ("userId") REFERENCES "User"("id")
  );

  CREATE TABLE IF NOT EXISTS "Subscriber" (
    "id"        TEXT    PRIMARY KEY,
    "active"    BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ehash"     TEXT    NOT NULL UNIQUE,
    "email"     TEXT    NOT NULL DEFAULT '',
    "language"  TEXT    NOT NULL DEFAULT 'en',
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS "Pattern" (
    "id"        INTEGER PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data"      TEXT    NOT NULL DEFAULT '',
    "design"    TEXT    NOT NULL DEFAULT '',
    "img"       TEXT,
    "name"      TEXT    NOT NULL DEFAULT '',
    "notes"     TEXT    NOT NULL DEFAULT '',
    "public"    BOOLEAN NOT NULL DEFAULT 0,
    "settings"  TEXT    NOT NULL DEFAULT '',
    "userId"    INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id")
  );

  CREATE INDEX IF NOT EXISTS "Pattern_userId_design_idx" ON "Pattern"("userId", "design");

  CREATE TABLE IF NOT EXISTS "Set" (
    "id"        INTEGER PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "img"       TEXT,
    "imperial"  BOOLEAN NOT NULL DEFAULT 0,
    "name"      TEXT    NOT NULL DEFAULT '',
    "notes"     TEXT    NOT NULL DEFAULT '',
    "userId"    INTEGER NOT NULL,
    "measies"   TEXT    NOT NULL DEFAULT '{}',
    "public"    BOOLEAN NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id")
  );

  CREATE INDEX IF NOT EXISTS "Set_userId_idx" ON "Set"("userId");

  CREATE TABLE IF NOT EXISTS "CuratedSet" (
    "id"        INTEGER PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "height"    INTEGER NOT NULL DEFAULT 1,
    "info"      TEXT    NOT NULL DEFAULT '',
    "nameDe"    TEXT    NOT NULL DEFAULT '',
    "nameEn"    TEXT    NOT NULL DEFAULT '',
    "nameEs"    TEXT    NOT NULL DEFAULT '',
    "nameFr"    TEXT    NOT NULL DEFAULT '',
    "nameNl"    TEXT    NOT NULL DEFAULT '',
    "nameUk"    TEXT    NOT NULL DEFAULT '',
    "notesDe"   TEXT    NOT NULL DEFAULT '',
    "notesEn"   TEXT    NOT NULL DEFAULT '',
    "notesEs"   TEXT    NOT NULL DEFAULT '',
    "notesFr"   TEXT    NOT NULL DEFAULT '',
    "notesNl"   TEXT    NOT NULL DEFAULT '',
    "notesUk"   TEXT    NOT NULL DEFAULT '',
    "tags"      TEXT    NOT NULL DEFAULT '{}',
    "measies"   TEXT    NOT NULL DEFAULT '[]',
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS "OptionPack" (
    "id"        INTEGER PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "design"    TEXT    NOT NULL DEFAULT '',
    "img"       TEXT,
    "info"      TEXT    NOT NULL DEFAULT '',
    "nameDe"    TEXT    NOT NULL DEFAULT '',
    "nameEn"    TEXT    NOT NULL DEFAULT '',
    "nameEs"    TEXT    NOT NULL DEFAULT '',
    "nameFr"    TEXT    NOT NULL DEFAULT '',
    "nameNl"    TEXT    NOT NULL DEFAULT '',
    "nameUk"    TEXT    NOT NULL DEFAULT '',
    "notesDe"   TEXT    NOT NULL DEFAULT '',
    "notesEn"   TEXT    NOT NULL DEFAULT '',
    "notesEs"   TEXT    NOT NULL DEFAULT '',
    "notesFr"   TEXT    NOT NULL DEFAULT '',
    "notesNl"   TEXT    NOT NULL DEFAULT '',
    "notesUk"   TEXT    NOT NULL DEFAULT '',
    "tags"      TEXT    NOT NULL DEFAULT '[]',
    "options"   TEXT    NOT NULL DEFAULT '{}',
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

console.log('Database schema initialized successfully.')
