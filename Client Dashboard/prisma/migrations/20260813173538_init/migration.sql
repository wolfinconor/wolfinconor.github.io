-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shareToken" TEXT NOT NULL,
    "clientNames" TEXT NOT NULL,
    "propertyAddress" TEXT NOT NULL,
    "propertyCity" TEXT NOT NULL,
    "offerAcceptedDate" DATETIME NOT NULL,
    "targetClosingDate" DATETIME NOT NULL,
    "currentStatusLabel" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TimelineStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "TimelineStep_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NextStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    CONSTRAINT "NextStep_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CostItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "isTotal" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CostItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TodoItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    CONSTRAINT "TodoItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_shareToken_key" ON "Transaction"("shareToken");
