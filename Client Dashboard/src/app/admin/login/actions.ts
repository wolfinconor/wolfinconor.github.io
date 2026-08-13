"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { verifyAdminCredentials } from "@/lib/auth";

export async function login(_prevState: { error?: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminCredentials(email, password)) {
    return { error: "Invalid email or password." };
  }

  const session = await getSession();
  session.isAdmin = true;
  await session.save();

  redirect("/admin");
}
