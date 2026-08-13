import type {
  Transaction,
  TimelineStep,
  NextStep,
  CostItem,
  TodoItem,
} from "@prisma/client";
import type { TransactionData } from "./types";

type FullTransaction = Transaction & {
  timelineSteps: TimelineStep[];
  nextSteps: NextStep[];
  costItems: CostItem[];
  todoItems: TodoItem[];
};

export function serializeTransaction(t: FullTransaction): TransactionData {
  return {
    id: t.id,
    shareToken: t.shareToken,
    clientNames: t.clientNames,
    propertyAddress: t.propertyAddress,
    propertyCity: t.propertyCity,
    offerAcceptedDate: t.offerAcceptedDate.toISOString(),
    targetClosingDate: t.targetClosingDate.toISOString(),
    currentStatusLabel: t.currentStatusLabel,
    timelineSteps: t.timelineSteps.map((s) => ({
      id: s.id,
      label: s.label,
      date: s.date,
      order: s.order,
      status: s.status as "done" | "current" | "upcoming",
    })),
    nextSteps: t.nextSteps.map((s) => ({
      id: s.id,
      text: s.text,
      dueDate: s.dueDate,
      order: s.order,
      status: s.status as "open" | "done",
    })),
    costItems: t.costItems.map((c) => ({
      id: c.id,
      label: c.label,
      amount: c.amount,
      order: c.order,
      isTotal: c.isTotal,
    })),
    todoItems: t.todoItems.map((td) => ({
      id: td.id,
      text: td.text,
      assignedTo: td.assignedTo,
      order: td.order,
      status: td.status as "open" | "done",
    })),
  };
}

export const transactionInclude = {
  timelineSteps: { orderBy: { order: "asc" as const } },
  nextSteps: { orderBy: { order: "asc" as const } },
  costItems: { orderBy: { order: "asc" as const } },
  todoItems: { orderBy: { order: "asc" as const } },
};
