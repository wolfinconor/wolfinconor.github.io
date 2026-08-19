-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "listingUrl" TEXT,
    "imageUrl" TEXT,
    "address" TEXT,
    "city" TEXT,
    "price" INTEGER,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'comparing',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "offerAcceptedDate" DATETIME,
    "targetClosingDate" DATETIME,
    "currentStatusLabel" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Property_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("address", "city", "clientId", "createdAt", "currentStatusLabel", "id", "imageUrl", "listingUrl", "notes", "offerAcceptedDate", "order", "price", "status", "targetClosingDate", "updatedAt") SELECT "address", "city", "clientId", "createdAt", "currentStatusLabel", "id", "imageUrl", "listingUrl", "notes", "offerAcceptedDate", "order", "price", "status", "targetClosingDate", "updatedAt" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
