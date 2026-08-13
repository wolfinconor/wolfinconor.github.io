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

export type TransactionData = {
  id: string;
  shareToken: string;
  clientNames: string;
  propertyAddress: string;
  propertyCity: string;
  offerAcceptedDate: string;
  targetClosingDate: string;
  currentStatusLabel: string;
  timelineSteps: TimelineStepData[];
  nextSteps: NextStepData[];
  costItems: CostItemData[];
  todoItems: TodoItemData[];
};

export function formatDateShort(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
