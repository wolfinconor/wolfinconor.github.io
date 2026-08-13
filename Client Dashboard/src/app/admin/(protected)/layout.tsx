import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "./logout-actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-bold text-charcoal">
            Buyer Led Representation &middot; Admin
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-semibold text-warm-gray hover:text-terracotta"
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
