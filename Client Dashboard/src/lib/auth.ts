import { redirect } from "next/navigation";
import { getSession } from "./session";

export function verifyAdminCredentials(email: string, password: string) {
  return (
    email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD
  );
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.isAdmin) {
    redirect("/admin/login");
  }
}
