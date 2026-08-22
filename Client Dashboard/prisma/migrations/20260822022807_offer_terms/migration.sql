-- CreateTable
CREATE TABLE "OfferTerms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "propertyId" TEXT NOT NULL,
    "offerPrice" INTEGER,
    "earnestMoney" INTEGER,
    "financingType" TEXT NOT NULL DEFAULT 'conventional',
    "downPaymentPercent" INTEGER,
    "hasInspection" BOOLEAN NOT NULL DEFAULT true,
    "inspectionCost" INTEGER,
    "inspectionPeriodDays" INTEGER,
    "hasAppraisal" BOOLEAN NOT NULL DEFAULT true,
    "appraisalCost" INTEGER,
    "appraisalPeriodDays" INTEGER,
    "hasHomeWarranty" BOOLEAN NOT NULL DEFAULT false,
    "homeWarrantyCost" INTEGER,
    "sellerConcessions" INTEGER,
    "saleContingency" BOOLEAN NOT NULL DEFAULT false,
    "hasEscalation" BOOLEAN NOT NULL DEFAULT false,
    "escalationCap" INTEGER,
    "closingCostEstimate" INTEGER,
    "personalProperty" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OfferTerms_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "OfferTerms_propertyId_key" ON "OfferTerms"("propertyId");
