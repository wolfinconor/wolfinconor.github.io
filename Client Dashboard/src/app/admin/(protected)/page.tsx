import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateShort } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminTransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-charcoal">Transactions</h1>
        <Link
          href="/admin/new"
          className="rounded-pill bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + New transaction
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="text-warm-gray">
          No transactions yet. Create one to get started.
        </p>
      ) : (
        <div className="overflow-hidden rounded-card border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-cream-tint text-xs uppercase tracking-wide text-warm-gray">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Target closing</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-charcoal">
                    {t.clientNames}
                  </td>
                  <td className="px-4 py-3 text-charcoal">
                    {t.propertyAddress}, {t.propertyCity}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-pill bg-sage-pale px-3 py-1 text-xs font-semibold text-sage-dark">
                      {t.currentStatusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-charcoal">
                    {formatDateShort(t.targetClosingDate)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <a
                        href={`/dashboard/${t.shareToken}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-sage-dark hover:underline"
                      >
                        View as client
                      </a>
                      <Link
                        href={`/admin/${t.id}`}
                        className="font-semibold text-terracotta hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
