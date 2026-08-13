"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function generateShareToken() {
  return randomBytes(24).toString("base64url");
}

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

// ---------- Transaction ----------

export async function createTransaction(formData: FormData) {
  await requireAdmin();

  const transaction = await prisma.transaction.create({
    data: {
      shareToken: generateShareToken(),
      clientNames: str(formData, "clientNames"),
      propertyAddress: str(formData, "propertyAddress"),
      propertyCity: str(formData, "propertyCity"),
      offerAcceptedDate: new Date(str(formData, "offerAcceptedDate")),
      targetClosingDate: new Date(str(formData, "targetClosingDate")),
      currentStatusLabel: str(formData, "currentStatusLabel"),
    },
  });

  revalidatePath("/admin");
  redirect(`/admin/${transaction.id}`);
}

export async function updateTransaction(transactionId: string, formData: FormData) {
  await requireAdmin();

  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      clientNames: str(formData, "clientNames"),
      propertyAddress: str(formData, "propertyAddress"),
      propertyCity: str(formData, "propertyCity"),
      offerAcceptedDate: new Date(str(formData, "offerAcceptedDate")),
      targetClosingDate: new Date(str(formData, "targetClosingDate")),
      currentStatusLabel: str(formData, "currentStatusLabel"),
    },
  });

  revalidatePath(`/admin/${transactionId}`);
  revalidatePath("/admin");
}

export async function deleteTransaction(transactionId: string) {
  await requireAdmin();

  await prisma.transaction.delete({ where: { id: transactionId } });
  revalidatePath("/admin");
  redirect("/admin");
}

// ---------- Timeline steps ----------

export async function addTimelineStep(transactionId: string, formData: FormData) {
  await requireAdmin();

  const count = await prisma.timelineStep.count({ where: { transactionId } });
  await prisma.timelineStep.create({
    data: {
      transactionId,
      label: str(formData, "label"),
      date: str(formData, "date"),
      status: str(formData, "status") || "upcoming",
      order: count + 1,
    },
  });
  revalidatePath(`/admin/${transactionId}`);
}

export async function updateTimelineStep(
  transactionId: string,
  stepId: string,
  formData: FormData,
) {
  await requireAdmin();

  await prisma.timelineStep.update({
    where: { id: stepId },
    data: {
      label: str(formData, "label"),
      date: str(formData, "date"),
      status: str(formData, "status"),
    },
  });
  revalidatePath(`/admin/${transactionId}`);
}

export async function deleteTimelineStep(transactionId: string, stepId: string) {
  await requireAdmin();

  await prisma.timelineStep.delete({ where: { id: stepId } });
  revalidatePath(`/admin/${transactionId}`);
}

export async function moveTimelineStep(
  transactionId: string,
  stepId: string,
  direction: "up" | "down",
) {
  await requireAdmin();

  const steps = await prisma.timelineStep.findMany({
    where: { transactionId },
    orderBy: { order: "asc" },
  });
  const index = steps.findIndex((s) => s.id === stepId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= steps.length) return;

  const a = steps[index];
  const b = steps[swapWith];
  await prisma.$transaction([
    prisma.timelineStep.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.timelineStep.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidatePath(`/admin/${transactionId}`);
}

// ---------- Next steps ----------

export async function addNextStep(transactionId: string, formData: FormData) {
  await requireAdmin();

  const count = await prisma.nextStep.count({ where: { transactionId } });
  await prisma.nextStep.create({
    data: {
      transactionId,
      text: str(formData, "text"),
      dueDate: str(formData, "dueDate"),
      status: "open",
      order: count + 1,
    },
  });
  revalidatePath(`/admin/${transactionId}`);
}

export async function toggleNextStep(
  transactionId: string,
  stepId: string,
  formData: FormData,
) {
  await requireAdmin();

  const done = formData.getAll("done").includes("true");
  await prisma.nextStep.update({
    where: { id: stepId },
    data: { status: done ? "done" : "open" },
  });
  revalidatePath(`/admin/${transactionId}`);
}

export async function deleteNextStep(transactionId: string, stepId: string) {
  await requireAdmin();

  await prisma.nextStep.delete({ where: { id: stepId } });
  revalidatePath(`/admin/${transactionId}`);
}

// ---------- Cost items ----------

export async function addCostItem(transactionId: string, formData: FormData) {
  await requireAdmin();

  const count = await prisma.costItem.count({ where: { transactionId } });
  await prisma.costItem.create({
    data: {
      transactionId,
      label: str(formData, "label"),
      amount: Math.round(Number(str(formData, "amount")) || 0),
      isTotal: formData.get("isTotal") === "on",
      order: count + 1,
    },
  });
  revalidatePath(`/admin/${transactionId}`);
}

export async function updateCostItem(
  transactionId: string,
  costId: string,
  formData: FormData,
) {
  await requireAdmin();

  await prisma.costItem.update({
    where: { id: costId },
    data: {
      label: str(formData, "label"),
      amount: Math.round(Number(str(formData, "amount")) || 0),
      isTotal: formData.get("isTotal") === "on",
    },
  });
  revalidatePath(`/admin/${transactionId}`);
}

export async function deleteCostItem(transactionId: string, costId: string) {
  await requireAdmin();

  await prisma.costItem.delete({ where: { id: costId } });
  revalidatePath(`/admin/${transactionId}`);
}

// ---------- To-do items ----------

export async function addTodoItem(transactionId: string, formData: FormData) {
  await requireAdmin();

  const count = await prisma.todoItem.count({ where: { transactionId } });
  await prisma.todoItem.create({
    data: {
      transactionId,
      text: str(formData, "text"),
      assignedTo: str(formData, "assignedTo"),
      status: "open",
      order: count + 1,
    },
  });
  revalidatePath(`/admin/${transactionId}`);
}

export async function toggleTodoItem(
  transactionId: string,
  todoId: string,
  formData: FormData,
) {
  await requireAdmin();

  const done = formData.getAll("done").includes("true");
  await prisma.todoItem.update({
    where: { id: todoId },
    data: { status: done ? "done" : "open" },
  });
  revalidatePath(`/admin/${transactionId}`);
}

export async function deleteTodoItem(transactionId: string, todoId: string) {
  await requireAdmin();

  await prisma.todoItem.delete({ where: { id: todoId } });
  revalidatePath(`/admin/${transactionId}`);
}
