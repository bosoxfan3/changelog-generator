/*
  Warnings:

  - Added the required column `title` to the `Changelog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Changelog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "repoOwner" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Changelog" ("content", "createdAt", "from", "id", "project", "repoOwner", "to") SELECT "content", "createdAt", "from", "id", "project", "repoOwner", "to" FROM "Changelog";
DROP TABLE "Changelog";
ALTER TABLE "new_Changelog" RENAME TO "Changelog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
