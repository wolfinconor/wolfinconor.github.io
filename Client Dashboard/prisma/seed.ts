import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

function generateShareToken() {
  return randomBytes(24).toString("base64url");
}

async function main() {
  await prisma.transaction.deleteMany();

  const transaction = await prisma.transaction.create({
    data: {
      shareToken: generateShareToken(),
      clientNames: "Sarah & Jordan",
      propertyAddress: "4127 Maple Street",
      propertyCity: "Tacoma, WA",
      offerAcceptedDate: new Date("2026-07-28"),
      targetClosingDate: new Date("2026-09-15"),
      currentStatusLabel: "Inspection Period",
      timelineSteps: {
        create: [
          { label: "Offer Submitted", date: "Jul 26", order: 1, status: "done" },
          { label: "Offer Accepted", date: "Jul 28", order: 2, status: "done" },
          { label: "Inspection", date: "Due Aug 12", order: 3, status: "current" },
          { label: "Appraisal", date: "Aug 20", order: 4, status: "upcoming" },
          { label: "Financing", date: "Sep 5", order: 5, status: "upcoming" },
          { label: "Closing", date: "Sep 15", order: 6, status: "upcoming" },
        ],
      },
      nextSteps: {
        create: [
          {
            text: "Schedule your home inspector",
            dueDate: "Due Aug 12",
            order: 1,
            status: "open",
          },
          {
            text: "Send earnest money to escrow",
            dueDate: "Due Aug 1",
            order: 2,
            status: "open",
          },
          {
            text: "Sign and return purchase agreement",
            dueDate: "Completed Jul 28",
            order: 3,
            status: "done",
          },
        ],
      },
      costItems: {
        create: [
          { label: "Earnest money", amount: 8000, order: 1, isTotal: false },
          { label: "Inspection fee", amount: 650, order: 2, isTotal: false },
          { label: "Appraisal fee", amount: 775, order: 3, isTotal: false },
          { label: "Buyer-Led flat fee", amount: 5000, order: 4, isTotal: false },
          { label: "Est. closing costs", amount: 9400, order: 5, isTotal: false },
          { label: "Due at closing", amount: 23825, order: 6, isTotal: true },
        ],
      },
      todoItems: {
        create: [
          {
            text: "Submit loan documents to lender",
            assignedTo: "You",
            order: 1,
            status: "done",
          },
          {
            text: "Order title search",
            assignedTo: "Conor",
            order: 2,
            status: "done",
          },
          {
            text: "Book home inspector",
            assignedTo: "You",
            order: 3,
            status: "open",
          },
          {
            text: "Review seller disclosure form",
            assignedTo: "You & Conor",
            order: 4,
            status: "open",
          },
        ],
      },
    },
  });

  console.log("Seeded transaction for", transaction.clientNames);
  console.log("Client dashboard link:");
  console.log(`  /dashboard/${transaction.shareToken}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
