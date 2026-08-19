import type {
  Client,
  Property,
  TimelineStep,
  NextStep,
  CostItem,
  TodoItem,
} from "@prisma/client";
import type { ClientData, PropertyData } from "./types";

type FullProperty = Property & {
  timelineSteps: TimelineStep[];
  nextSteps: NextStep[];
  costItems: CostItem[];
  todoItems: TodoItem[];
};

type FullClient = Client & {
  properties: FullProperty[];
};

export function serializeProperty(p: FullProperty): PropertyData {
  return {
    id: p.id,
    listingUrl: p.listingUrl,
    imageUrl: p.imageUrl,
    address: p.address,
    city: p.city,
    price: p.price,
    notes: p.notes,
    status: p.status as PropertyData["status"],
    order: p.order,
    isFavorite: p.isFavorite,
    offerAcceptedDate: p.offerAcceptedDate ? p.offerAcceptedDate.toISOString() : null,
    targetClosingDate: p.targetClosingDate ? p.targetClosingDate.toISOString() : null,
    currentStatusLabel: p.currentStatusLabel,
    timelineSteps: p.timelineSteps.map((s) => ({
      id: s.id,
      label: s.label,
      date: s.date,
      order: s.order,
      status: s.status as "done" | "current" | "upcoming",
    })),
    nextSteps: p.nextSteps.map((s) => ({
      id: s.id,
      text: s.text,
      dueDate: s.dueDate,
      order: s.order,
      status: s.status as "open" | "done",
    })),
    costItems: p.costItems.map((c) => ({
      id: c.id,
      label: c.label,
      amount: c.amount,
      order: c.order,
      isTotal: c.isTotal,
    })),
    todoItems: p.todoItems.map((td) => ({
      id: td.id,
      text: td.text,
      assignedTo: td.assignedTo,
      order: td.order,
      status: td.status as "open" | "done",
    })),
  };
}

export function serializeClient(c: FullClient): ClientData {
  return {
    id: c.id,
    shareToken: c.shareToken,
    name: c.name,
    properties: c.properties
      .map(serializeProperty)
      .sort((a, b) => a.order - b.order),
  };
}

export const propertyInclude = {
  timelineSteps: { orderBy: { order: "asc" as const } },
  nextSteps: { orderBy: { order: "asc" as const } },
  costItems: { orderBy: { order: "asc" as const } },
  todoItems: { orderBy: { order: "asc" as const } },
};

export const clientInclude = {
  properties: {
    orderBy: { order: "asc" as const },
    include: propertyInclude,
  },
};
