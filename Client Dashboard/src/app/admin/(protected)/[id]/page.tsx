import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { propertyLabel, formatCurrency } from "@/lib/types";
import { PropertyThumb } from "@/components/dashboard/PropertyThumb";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";
import { updateClient, deleteClient, addProperty } from "../actions";

const inputClass =
  "w-full rounded-[10px] border border-line px-3 py-2 text-sm outline-none focus:border-terracotta";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  comparing: "Comparing",
  active: "Active offer",
  closed: "Closed",
};

export default async function ClientPage({ params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: { properties: { orderBy: { order: "asc" } } },
  });

  if (!client) {
    notFound();
  }

  const id = client.id;
  const dashboardUrl = `/dashboard/${client.shareToken}`;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin" className="text-sm font-semibold text-warm-gray hover:text-terracotta">
          &larr; All clients
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-white p-6">
        <div>
          <p className="text-sm font-semibold text-warm-gray">Client link</p>
          <p className="font-mono text-sm text-charcoal">{dashboardUrl}</p>
        </div>
        <div className="flex gap-3">
          <a
            href={dashboardUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-pill border border-line px-4 py-1.5 text-sm font-semibold text-charcoal hover:border-terracotta"
          >
            View as client
          </a>
          <CopyLinkButton url={dashboardUrl} />
        </div>
      </div>

      <section className="rounded-card border border-line bg-white p-6">
        <h2 className="mb-4 font-bold text-charcoal">Client details</h2>
        <form action={updateClient.bind(null, id)} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[12rem]">
            <label className="mb-1 block text-sm font-semibold text-charcoal">
              Client name(s)
            </label>
            <input name="name" defaultValue={client.name} required className={inputClass} />
          </div>
          <button
            type="submit"
            className="rounded-pill bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Save
          </button>
        </form>
      </section>

      <section className="rounded-card border border-line bg-white p-6">
        <h2 className="mb-4 font-bold text-charcoal">Homes ({client.properties.length})</h2>

        {client.properties.length === 0 ? (
          <p className="mb-4 text-sm text-warm-gray">
            No homes added yet. Add a listing link below.
          </p>
        ) : (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {client.properties.map((p) => (
              <Link
                key={p.id}
                href={`/admin/${id}/${p.id}`}
                className="group overflow-hidden rounded-[10px] border border-line hover:border-terracotta"
              >
                <PropertyThumb imageUrl={p.imageUrl} alt={propertyLabel(p)} className="h-32 w-full" />
                <div className="space-y-1 p-3">
                  <p className="truncate text-sm font-bold text-charcoal group-hover:text-terracotta">
                    {p.isFavorite && "★ "}
                    {propertyLabel(p)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-warm-gray">
                      {p.price ? formatCurrency(p.price) : "No price"}
                    </span>
                    <span className="rounded-pill bg-sage-pale px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage-dark">
                      {STATUS_LABELS[p.status] ?? p.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <form action={addProperty.bind(null, id)} className="space-y-3 border-t border-line pt-4">
          <p className="text-sm font-semibold text-charcoal">Add a home</p>
          <input
            name="listingUrl"
            placeholder="Zillow / Redfin / Homes.com link"
            className={inputClass}
          />
          <div className="grid grid-cols-2 gap-3">
            <input name="address" placeholder="Address (optional)" className={inputClass} />
            <input name="city" placeholder="City, state (optional)" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="price"
              placeholder="List price (optional)"
              className={inputClass}
            />
            <input name="notes" placeholder="Notes (optional)" className={inputClass} />
          </div>
          <button
            type="submit"
            className="rounded-pill bg-sage px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            + Add home
          </button>
        </form>
      </section>

      <section className="rounded-card border border-terracotta-light bg-terracotta-pale p-6">
        <h2 className="mb-2 font-bold text-charcoal">Delete client</h2>
        <p className="mb-4 text-sm text-warm-gray">
          This permanently removes the client, every home on their list, and their
          dashboard link. This can&apos;t be undone.
        </p>
        <form action={deleteClient.bind(null, id)}>
          <button
            type="submit"
            className="rounded-pill bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Delete client
          </button>
        </form>
      </section>
    </div>
  );
}
