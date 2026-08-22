import { prisma } from "@/lib/prisma";

export type OfferTermsInput = {
  offerPrice: number | null;
  earnestMoney: number | null;
  financingType: string;
  downPaymentPercent: number | null;
  hasInspection: boolean;
  inspectionCost: number | null;
  inspectionPeriodDays: number | null;
  hasAppraisal: boolean;
  appraisalCost: number | null;
  appraisalPeriodDays: number | null;
  hasHomeWarranty: boolean;
  homeWarrantyCost: number | null;
  sellerConcessions: number | null;
  saleContingency: boolean;
  hasEscalation: boolean;
  escalationCap: number | null;
  closingCostEstimate: number | null;
  personalProperty: string | null;
};

const ADVISORY_FEE_LABEL = "Buyer-Led flat fee";
const DEFAULT_ADVISORY_FEE = 5000;

const MANAGED_COST_LABELS = [
  "Earnest money",
  "Inspection fee",
  "Appraisal fee",
  "Home warranty",
  "Est. closing costs",
  "Due at closing",
];

const MANAGED_TIMELINE_LABELS = [
  "Building the Offer",
  "Offer Submitted",
  "Offer Accepted",
  "Inspection Period",
  "Appraisal Period",
  "Financing",
  "Closing",
];

function optInt(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;
  const n = Math.round(Number(raw));
  return Number.isFinite(n) ? n : null;
}

function optStr(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  return raw ? raw : null;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export function parseOfferTermsForm(formData: FormData): OfferTermsInput {
  return {
    offerPrice: optInt(formData, "offerPrice"),
    earnestMoney: optInt(formData, "earnestMoney"),
    financingType: String(formData.get("financingType") ?? "conventional") || "conventional",
    downPaymentPercent: optInt(formData, "downPaymentPercent"),
    hasInspection: bool(formData, "hasInspection"),
    inspectionCost: optInt(formData, "inspectionCost"),
    inspectionPeriodDays: optInt(formData, "inspectionPeriodDays"),
    hasAppraisal: bool(formData, "hasAppraisal"),
    appraisalCost: optInt(formData, "appraisalCost"),
    appraisalPeriodDays: optInt(formData, "appraisalPeriodDays"),
    hasHomeWarranty: bool(formData, "hasHomeWarranty"),
    homeWarrantyCost: optInt(formData, "homeWarrantyCost"),
    sellerConcessions: optInt(formData, "sellerConcessions"),
    saleContingency: bool(formData, "saleContingency"),
    hasEscalation: bool(formData, "hasEscalation"),
    escalationCap: optInt(formData, "escalationCap"),
    closingCostEstimate: optInt(formData, "closingCostEstimate"),
    personalProperty: optStr(formData, "personalProperty"),
  };
}

async function ensureAdvisoryFee(propertyId: string) {
  const existing = await prisma.costItem.findFirst({
    where: { propertyId, label: ADVISORY_FEE_LABEL },
  });
  if (existing) return;
  await prisma.costItem.create({
    data: { propertyId, label: ADVISORY_FEE_LABEL, amount: DEFAULT_ADVISORY_FEE, order: 0, isTotal: false },
  });
}

async function rebuildCostOrder(propertyId: string) {
  const items = await prisma.costItem.findMany({ where: { propertyId } });
  const rank = (label: string) => {
    if (label === "Due at closing") return 999;
    const idx = MANAGED_COST_LABELS.indexOf(label);
    if (idx !== -1) return idx;
    if (label === ADVISORY_FEE_LABEL) return 90;
    return 95;
  };
  items.sort((a, b) => rank(a.label) - rank(b.label) || a.order - b.order);
  let order = 1;
  for (const item of items) {
    await prisma.costItem.update({ where: { id: item.id }, data: { order: order++ } });
  }
}

async function rebuildTimelineOrder(propertyId: string) {
  const steps = await prisma.timelineStep.findMany({ where: { propertyId } });
  const rank = (label: string) => {
    const idx = MANAGED_TIMELINE_LABELS.indexOf(label);
    return idx === -1 ? 100 : idx;
  };
  steps.sort((a, b) => rank(a.label) - rank(b.label) || a.order - b.order);
  let order = 1;
  for (const step of steps) {
    await prisma.timelineStep.update({ where: { id: step.id }, data: { order: order++ } });
  }
}

export async function applyOfferTerms(propertyId: string, input: OfferTermsInput) {
  await prisma.offerTerms.upsert({
    where: { propertyId },
    create: { propertyId, ...input },
    update: { ...input },
  });

  // ---- Cost items: wipe and regenerate everything this tool owns, leaving
  // any manually-added admin cost item (and the advisory fee) untouched. ----
  await prisma.costItem.deleteMany({
    where: { propertyId, label: { in: MANAGED_COST_LABELS } },
  });
  await ensureAdvisoryFee(propertyId);

  const lineItems: { label: string; amount: number }[] = [];
  if (input.earnestMoney) lineItems.push({ label: "Earnest money", amount: input.earnestMoney });
  if (input.hasInspection && input.inspectionCost) {
    lineItems.push({ label: "Inspection fee", amount: input.inspectionCost });
  }
  if (input.hasAppraisal && input.appraisalCost) {
    lineItems.push({ label: "Appraisal fee", amount: input.appraisalCost });
  }
  if (input.hasHomeWarranty && input.homeWarrantyCost) {
    lineItems.push({ label: "Home warranty", amount: input.homeWarrantyCost });
  }
  if (input.closingCostEstimate) {
    lineItems.push({ label: "Est. closing costs", amount: input.closingCostEstimate });
  }

  for (const item of lineItems) {
    await prisma.costItem.create({
      data: { propertyId, label: item.label, amount: item.amount, order: 0, isTotal: false },
    });
  }

  const advisoryFee = await prisma.costItem.findFirst({
    where: { propertyId, label: ADVISORY_FEE_LABEL },
  });
  const total = lineItems.reduce((sum, i) => sum + i.amount, 0) + (advisoryFee?.amount ?? 0);
  await prisma.costItem.create({
    data: { propertyId, label: "Due at closing", amount: total, order: 0, isTotal: true },
  });

  await rebuildCostOrder(propertyId);

  // ---- Timeline steps: same wipe-and-regenerate approach, scoped to the
  // labels this tool owns. ----
  await prisma.timelineStep.deleteMany({
    where: { propertyId, label: { in: MANAGED_TIMELINE_LABELS } },
  });

  const steps: { label: string; date: string; status: string }[] = [
    { label: "Building the Offer", date: "Complete", status: "done" },
    { label: "Offer Submitted", date: "Submitted", status: "current" },
    { label: "Offer Accepted", date: "TBD", status: "upcoming" },
  ];
  if (input.hasInspection) {
    steps.push({
      label: "Inspection Period",
      date: input.inspectionPeriodDays ? `${input.inspectionPeriodDays}-day period` : "TBD",
      status: "upcoming",
    });
  }
  if (input.hasAppraisal) {
    steps.push({
      label: "Appraisal Period",
      date: input.appraisalPeriodDays ? `${input.appraisalPeriodDays}-day period` : "TBD",
      status: "upcoming",
    });
  }
  if (input.financingType !== "cash") {
    steps.push({ label: "Financing", date: "TBD", status: "upcoming" });
  }
  steps.push({ label: "Closing", date: "TBD", status: "upcoming" });

  for (const step of steps) {
    await prisma.timelineStep.create({
      data: { propertyId, label: step.label, date: step.date, status: step.status, order: 0 },
    });
  }

  await rebuildTimelineOrder(propertyId);
}
