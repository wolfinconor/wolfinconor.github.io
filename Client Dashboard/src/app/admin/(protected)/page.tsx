import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { propertyLabel } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { properties: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-charcoal">Clients</h1>
        <Link
          href="/admin/new"
          className="rounded-pill bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + New client
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="text-warm-gray">No clients yet. Add one to get started.</p>
      ) : (
        <div className="overflow-hidden rounded-card border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-cream-tint text-xs uppercase tracking-wide text-warm-gray">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Homes</th>
                <th className="px-4 py-3">Active offer</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => {
                const active = c.properties.find((p) => p.status === "active");
                return (
                  <tr key={c.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-semibold text-charcoal">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-charcoal">
                      {c.properties.length}
                    </td>
                    <td className="px-4 py-3">
                      {active ? (
                        <span className="rounded-pill bg-sage-pale px-3 py-1 text-xs font-semibold text-sage-dark">
                          {propertyLabel(active)}
                        </span>
                      ) : (
                        <span className="text-warm-gray">&mdash;</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-4">
                        <a
                          href={`/dashboard/${c.shareToken}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-sage-dark hover:underline"
                        >
                          View as client
                        </a>
                        <Link
                          href={`/admin/${c.id}`}
                          className="font-semibold text-terracotta hover:underline"
                        >
                          Manage
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
