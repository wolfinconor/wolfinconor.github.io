"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { fetchListingImage } from "@/lib/scrapeListing";
import { DEFAULT_TIMELINE_TEMPLATE } from "@/lib/timelineTemplate";

function generateShareToken() {
  return randomBytes(24).toString("base64url");
}

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalStr(formData: FormData, key: string) {
  const value = str(formData, key);
  return value.length > 0 ? value : null;
}

function optionalInt(formData: FormData, key: string) {
  const value = str(formData, key);
  if (!value) return null;
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? n : null;
}

function optionalDate(formData: FormData, key: string) {
  const value = str(formData, key);
  return value ? new Date(value) : null;
}

// ---------- Clients ----------

export async function createClient(formData: FormData) {
  await requireAdmin();

  const client = await prisma.client.create({
    data: {
      shareToken: generateShareToken(),
      name: str(formData, "name"),
    },
  });

  revalidatePath("/admin");
  redirect(`/admin/${client.id}`);
}

export async function updateClient(clientId: string, formData: FormData) {
  await requireAdmin();

  await prisma.client.update({
    where: { id: clientId },
    data: { name: str(formData, "name") },
  });

  revalidatePath(`/admin/${clientId}`);
  revalidatePath("/admin");
}

export async function deleteClient(clientId: string) {
  await requireAdmin();

  await prisma.client.delete({ where: { id: clientId } });
  revalidatePath("/admin");
  redirect("/admin");
}

// ---------- Properties ----------

export async function addProperty(clientId: string, formData: FormData) {
  await requireAdmin();

  const listingUrl = optionalStr(formData, "listingUrl");
  const imageUrl = listingUrl ? await fetchListingImage(listingUrl) : null;

  const count = await prisma.property.count({ where: { clientId } });
  const property = await prisma.property.create({
    data: {
      clientId,
      listingUrl,
      imageUrl,
      address: optionalStr(formData, "address"),
      city: optionalStr(formData, "city"),
      price: optionalInt(formData, "price"),
      notes: optionalStr(formData, "notes"),
      order: count + 1,
    },
  });

  revalidatePath(`/admin/${clientId}`);
  redirect(`/admin/${clientId}/${property.id}`);
}

export async function updateProperty(
  clientId: string,
  propertyId: string,
  formData: FormData,
) {
  await requireAdmin();

  await prisma.property.update({
    where: { id: propertyId },
    data: {
      listingUrl: optionalStr(formData, "listingUrl"),
      imageUrl: optionalStr(formData, "imageUrl"),
      address: optionalStr(formData, "address"),
      city: optionalStr(formData, "city"),
      price: optionalInt(formData, "price"),
      notes: optionalStr(formData, "notes"),
    },
  });

  revalidatePath(`/admin/${clientId}/${propertyId}`);
  revalidatePath(`/admin/${clientId}`);
}

export async function deleteProperty(clientId: string, propertyId: string) {
  await requireAdmin();

  await prisma.property.delete({ where: { id: propertyId } });
  revalidatePath(`/admin/${clientId}`);
  redirect(`/admin/${clientId}`);
}

export async function promoteToOffer(
  clientId: string,
  propertyId: string,
  formData: FormData,
) {
  await requireAdmin();

  const existingSteps = await prisma.timelineStep.count({ where: { propertyId } });

  await prisma.property.update({
    where: { id: propertyId },
    data: {
      status: "active",
      offerAcceptedDate: optionalDate(formData, "offerAcceptedDate"),
      targetClosingDate: optionalDate(formData, "targetClosingDate"),
      currentStatusLabel: str(formData, "currentStatusLabel") || "Getting Started",
      timelineSteps:
        existingSteps === 0
          ? { create: DEFAULT_TIMELINE_TEMPLATE }
          : undefined,
    },
  });

  revalidatePath(`/admin/${clientId}/${propertyId}`);
  revalidatePath(`/admin/${clientId}`);
}

export async function setPropertyStatus(
  clientId: string,
  propertyId: string,
  formData: FormData,
) {
  await requireAdmin();

  await prisma.property.update({
    where: { id: propertyId },
    data: { status: str(formData, "status") },
  });

  revalidatePath(`/admin/${clientId}/${propertyId}`);
  revalidatePath(`/admin/${clientId}`);
}

// ---------- Timeline steps ----------

export async function addTimelineStep(
  clientId: string,
  propertyId: string,
  formData: FormData,
) {
  await requireAdmin();

  const count = await prisma.timelineStep.count({ where: { propertyId } });
  await prisma.timelineStep.create({
    data: {
      propertyId,
      label: str(formData, "label"),
      date: str(formData, "date"),
      status: str(formData, "status") || "upcoming",
      order: count + 1,
    },
  });
  revalidatePath(`/admin/${clientId}/${propertyId}`);
}

export async function updateTimelineStep(
  clientId: string,
  propertyId: string,
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
  revalidatePath(`/admin/${clientId}/${propertyId}`);
}

export async function deleteTimelineStep(
  clientId: string,
  propertyId: string,
  stepId: string,
) {
  await requireAdmin();

  await prisma.timelineStep.delete({ where: { id: stepId } });
  revalidatePath(`/admin/${clientId}/${propertyId}`);
}

export async function moveTimelineStep(
  clientId: string,
  propertyId: string,
  stepId: string,
  direction: "up" | "down",
) {
  await requireAdmin();

  const steps = await prisma.timelineStep.findMany({
    where: { propertyId },
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
  revalidatePath(`/admin/${clientId}/${propertyId}`);
}

// ---------- Next steps ----------

export async function addNextStep(
  clientId: string,
  propertyId: string,
  formData: FormData,
) {
  await requireAdmin();

  const count = await prisma.nextStep.count({ where: { propertyId } });
  await prisma.nextStep.create({
    data: {
      propertyId,
      text: str(formData, "text"),
      dueDate: str(formData, "dueDate"),
      status: "open",
      order: count + 1,
    },
  });
  revalidatePath(`/admin/${clientId}/${propertyId}`);
}

export async function toggleNextStep(
  clientId: string,
  propertyId: string,
  stepId: string,
  formData: FormData,
) {
  await requireAdmin();

  const done = formData.getAll("done").includes("true");
  await prisma.nextStep.update({
    where: { id: stepId },
    data: { status: done ? "done" : "open" },
  });
  revalidatePath(`/admin/${clientId}/${propertyId}`);
}

export async function deleteNextStep(
  clientId: string,
  propertyId: string,
  stepId: string,
) {
  await requireAdmin();

  await prisma.nextStep.delete({ where: { id: stepId } });
  revalidatePath(`/admin/${clientId}/${propertyId}`);
}

// ---------- Cost items ----------

export async function addCostItem(
  clientId: string,
  propertyId: string,
  formData: FormData,
) {
  await requireAdmin();

  const count = await prisma.costItem.count({ where: { propertyId } });
  await prisma.costItem.create({
    data: {
      propertyId,
      label: str(formData, "label"),
      amount: Math.round(Number(str(formData, "amount")) || 0),
      isTotal: formData.get("isTotal") === "on",
      order: count + 1,
    },
  });
  revalidatePath(`/admin/${clientId}/${propertyId}`);
}

export async function updateCostItem(
  clientId: string,
  propertyId: string,
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
  revalidatePath(`/admin/${clientId}/${propertyId}`);
}

export async function deleteCostItem(
  clientId: string,
  propertyId: string,
  costId: string,
) {
  await requireAdmin();

  await prisma.costItem.delete({ where: { id: costId } });
  revalidatePath(`/admin/${clientId}/${propertyId}`);
}

// ---------- To-do items ----------

export async function addTodoItem(
  clientId: string,
  propertyId: string,
  formData: FormData,
) {
  await requireAdmin();

  const count = await prisma.todoItem.count({ where: { propertyId } });
  await prisma.todoItem.create({
    data: {
      propertyId,
      text: str(formData, "text"),
      assignedTo: str(formData, "assignedTo"),
      status: "open",
      order: count + 1,
    },
  });
  revalidatePath(`/admin/${clientId}/${propertyId}`);
}

export async function toggleTodoItem(
  clientId: string,
  propertyId: string,
  todoId: string,
  formData: FormData,
) {
  await requireAdmin();

  const done = formData.getAll("done").includes("true");
  await prisma.todoItem.update({
    where: { id: todoId },
    data: { status: done ? "done" : "open" },
  });
  revalidatePath(`/admin/${clientId}/${propertyId}`);
}

export async function deleteTodoItem(
  clientId: string,
  propertyId: string,
  todoId: string,
) {
  await requireAdmin();

  await prisma.todoItem.delete({ where: { id: todoId } });
  revalidatePath(`/admin/${clientId}/${propertyId}`);
}
