CREATE TABLE IF NOT EXISTS "Apikey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "aud" TEXT NOT NULL DEFAULT '',
    "calls" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "lastSeen" DATETIME,
    "level" INTEGER NOT NULL DEFAULT 0,
    "secret" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Apikey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Bookmark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Confirmation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Confirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Subscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ehash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "updatedAt" DATETIME NOT NULL,
    "uuid" TEXT
);

CREATE TABLE IF NOT EXISTS "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bio" TEXT NOT NULL DEFAULT '',
    "compare" BOOLEAN NOT NULL DEFAULT true,
    "consent" INTEGER NOT NULL DEFAULT 0,
    "control" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" TEXT NOT NULL,
    "ehash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ihash" TEXT NOT NULL,
    "initial" TEXT NOT NULL,
    "imperial" BOOLEAN NOT NULL DEFAULT false,
    "jwtCalls" INTEGER NOT NULL DEFAULT 0,
    "keyCalls" INTEGER NOT NULL DEFAULT 0,
    "language" TEXT NOT NULL DEFAULT 'en',
    "lastSeen" DATETIME,
    "lusername" TEXT NOT NULL,
    "mfaSecret" TEXT NOT NULL DEFAULT '',
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "patron" INTEGER NOT NULL DEFAULT 0,
    "role" TEXT NOT NULL DEFAULT 'user',
    "status" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME,
    "username" TEXT NOT NULL,
    "uuid" TEXT,
    "nlid" TEXT
);

CREATE TABLE IF NOT EXISTS "Pattern" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" TEXT NOT NULL,
    "design" TEXT NOT NULL,
    "img" TEXT,
    "name" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "settings" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL, "uuid" TEXT,
    CONSTRAINT "Pattern_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Set" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "img" TEXT,
    "imperial" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "userId" INTEGER NOT NULL,
    "measies" TEXT NOT NULL DEFAULT '{}',
    "public" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL, "uuid" TEXT,
    CONSTRAINT "Set_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "CuratedSet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "height" INTEGER NOT NULL DEFAULT 1,
    "info" TEXT NOT NULL DEFAULT '',
    "nameDe" TEXT NOT NULL DEFAULT '',
    "nameEn" TEXT NOT NULL DEFAULT '',
    "nameEs" TEXT NOT NULL DEFAULT '',
    "nameFr" TEXT NOT NULL DEFAULT '',
    "nameNl" TEXT NOT NULL DEFAULT '',
    "nameUk" TEXT NOT NULL DEFAULT '',
    "notesDe" TEXT NOT NULL DEFAULT '',
    "notesEn" TEXT NOT NULL DEFAULT '',
    "notesEs" TEXT NOT NULL DEFAULT '',
    "notesFr" TEXT NOT NULL DEFAULT '',
    "notesNl" TEXT NOT NULL DEFAULT '',
    "notesUk" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '{}',
    "measies" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" DATETIME NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false
);

CREATE TRIGGER "User_uuid_nlid_insert"
AFTER INSERT ON "User"
WHEN NEW."uuid" IS NULL OR NEW."nlid" IS NULL
BEGIN
  UPDATE "User" SET
    "uuid" = lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
    "nlid" = lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))
  WHERE "id" = NEW."id" AND ("uuid" IS NULL OR "nlid" IS NULL);
END;

CREATE TRIGGER "Subscriber_uuid_insert"
AFTER INSERT ON "Subscriber"
WHEN NEW."uuid" IS NULL
BEGIN
  UPDATE "Subscriber" SET
    "uuid" = lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))
  WHERE "id" = NEW."id" AND "uuid" IS NULL;
END;

CREATE TRIGGER "Pattern_uuid_insert"
AFTER INSERT ON "Pattern"
WHEN NEW."uuid" IS NULL OR NEW."nlid" IS NULL
BEGIN
  UPDATE "Pattern" SET
    "uuid" = lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))
  WHERE "id" = NEW."id" AND "uuid" IS NULL;
END;

CREATE TRIGGER "Set_uuid_insert"
AFTER INSERT ON "Set"
WHEN NEW."uuid" IS NULL OR NEW."nlid" IS NULL
BEGIN
  UPDATE "Set" SET
    "uuid" = lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))
  WHERE "id" = NEW."id" AND "uuid" IS NULL;
END;

CREATE INDEX "User_ihash_idx" ON "User"("ihash");
CREATE INDEX "Pattern_userId_design_idx" ON "Pattern"("userId", "design");
CREATE INDEX "Set_userId_idx" ON "Set"("userId");
CREATE UNIQUE INDEX "Subscriber_uuid_key" ON "Subscriber"("uuid");
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");
CREATE UNIQUE INDEX "User_nlid_key" ON "User"("nlid");
CREATE UNIQUE INDEX "Subscriber_ehash_key" ON "Subscriber"("ehash");
CREATE UNIQUE INDEX "User_ehash_key" ON "User"("ehash");
CREATE UNIQUE INDEX "User_lusername_key" ON "User"("lusername");
CREATE UNIQUE INDEX "Pattern_uuid_key" ON "Pattern"("uuid");
CREATE UNIQUE INDEX "Set_uuid_key" ON "Set"("uuid");

