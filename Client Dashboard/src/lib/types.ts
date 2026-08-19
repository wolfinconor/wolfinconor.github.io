export type TimelineStepData = {
  id: string;
  label: string;
  date: string;
  order: number;
  status: "done" | "current" | "upcoming";
};

export type NextStepData = {
  id: string;
  text: string;
  dueDate: string;
  order: number;
  status: "open" | "done";
};

export type CostItemData = {
  id: string;
  label: string;
  amount: number;
  order: number;
  isTotal: boolean;
};

export type TodoItemData = {
  id: string;
  text: string;
  assignedTo: string;
  order: number;
  status: "open" | "done";
};

export type PropertyStatus = "comparing" | "active" | "closed";

export type PropertyData = {
  id: string;
  listingUrl: string | null;
  imageUrl: string | null;
  address: string | null;
  city: string | null;
  price: number | null;
  notes: string | null;
  status: PropertyStatus;
  order: number;
  isFavorite: boolean;
  offerAcceptedDate: string | null;
  targetClosingDate: string | null;
  currentStatusLabel: string | null;
  timelineSteps: TimelineStepData[];
  nextSteps: NextStepData[];
  costItems: CostItemData[];
  todoItems: TodoItemData[];
};

export type ClientData = {
  id: string;
  shareToken: string;
  name: string;
  properties: PropertyData[];
};

export function formatDateShort(date: Date | string | null | undefined) {
  if (!date) return "TBD";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function propertyLabel(property: {
  address: string | null;
  city: string | null;
  listingUrl: string | null;
}) {
  if (property.address) {
    return property.city ? `${property.address}, ${property.city}` : property.address;
  }
  if (property.listingUrl) {
    try {
      return new URL(property.listingUrl).hostname.replace(/^www\./, "");
    } catch {
      // fall through
    }
  }
  return "Untitled listing";
}

export function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
