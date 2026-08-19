"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { fetchListingMeta } from "@/lib/scrapeListing";
import { DEFAULT_TIMELINE_TEMPLATE } from "@/lib/timelineTemplate";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalStr(formData: FormData, key: string) {
  const value = str(formData, key);
  return value.length > 0 ? value : null;
}

async function requireClient(token: string) {
  const client = await prisma.client.findUnique({ where: { shareToken: token } });
  if (!client) {
    throw new Error("Client not found");
  }
  return client;
}

async function requireOwnedProperty(token: string, propertyId: string) {
  const client = await requireClient(token);
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property || property.clientId !== client.id) {
    throw new Error("Property not found");
  }
  return property;
}

export async function addPropertyAsClient(token: string, formData: FormData) {
  const client = await requireClient(token);

  const listingUrl = optionalStr(formData, "listingUrl");
  const scraped = listingUrl
    ? await fetchListingMeta(listingUrl)
    : { imageUrl: null, address: null, city: null, price: null };

  const count = await prisma.property.count({ where: { clientId: client.id } });
  await prisma.property.create({
    data: {
      clientId: client.id,
      listingUrl,
      imageUrl: scraped.imageUrl,
      address: scraped.address,
      city: scraped.city,
      price: scraped.price,
      notes: optionalStr(formData, "notes"),
      order: count + 1,
    },
  });

  revalidatePath(`/dashboard/${token}`);
}

export async function toggleFavoriteAsClient(token: string, propertyId: string) {
  const property = await requireOwnedProperty(token, propertyId);

  await prisma.property.update({
    where: { id: propertyId },
    data: { isFavorite: !property.isFavorite },
  });

  revalidatePath(`/dashboard/${token}`);
  revalidatePath(`/dashboard/${token}/${propertyId}`);
}

export async function removePropertyAsClient(token: string, propertyId: string) {
  const property = await requireOwnedProperty(token, propertyId);

  if (property.status !== "comparing") {
    // Homes already under offer can only be removed by the admin, so an
    // in-progress transaction's history is never lost from the client side.
    return;
  }

  await prisma.property.delete({ where: { id: propertyId } });
  revalidatePath(`/dashboard/${token}`);
}

export async function startOfferAsClient(token: string, propertyId: string) {
  const property = await requireOwnedProperty(token, propertyId);

  if (property.status === "comparing") {
    const existingSteps = await prisma.timelineStep.count({ where: { propertyId } });
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        status: "active",
        currentStatusLabel: property.currentStatusLabel ?? "Getting Started",
        timelineSteps:
          existingSteps === 0 ? { create: DEFAULT_TIMELINE_TEMPLATE } : undefined,
      },
    });
  }

  revalidatePath(`/dashboard/${token}`);
  revalidatePath(`/dashboard/${token}/${propertyId}`);
  redirect(`/dashboard/${token}/${propertyId}`);
}
