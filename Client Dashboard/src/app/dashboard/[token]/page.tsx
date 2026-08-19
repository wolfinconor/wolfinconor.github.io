import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeClient, clientInclude } from "@/lib/serialize";
import { propertyLabel, formatCurrency } from "@/lib/types";
import { PropertyThumb } from "@/components/dashboard/PropertyThumb";
import { AddPropertyForm } from "@/components/dashboard/AddPropertyForm";
import { startOfferAsClient } from "./actions";

export const dynamic = "force-dynamic";

export default async function ClientHomePage({
  params,
}: {
  params: { token: string };
}) {
  const client = await prisma.client.findUnique({
    where: { shareToken: params.token },
    include: clientInclude,
  });

  if (!client) {
    notFound();
  }

  const data = serializeClient(client);
  const comparing = data.properties.filter((p) => p.status === "comparing");
  const inProgress = data.properties.filter((p) => p.status === "active");

  return (
    <div className="space-y-8">
      {inProgress.length > 0 && (
        <div className="space-y-2">
          {inProgress.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/${data.shareToken}/${p.id}`}
              className="flex items-center justify-between rounded-card border border-sage bg-sage-pale px-5 py-3 text-sm font-semibold text-sage-dark hover:opacity-90"
            >
              <span>You&apos;re working on an offer for {propertyLabel(p)}</span>
              <span>View details &rarr;</span>
            </Link>
          ))}
        </div>
      )}

      <div>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Compare your homes
        </h1>
        <p className="mt-1 text-sm text-warm-gray">
          Add every home you&apos;re considering, then pick one to start an
          offer whenever you&apos;re ready.
        </p>
      </div>

      {comparing.length === 0 ? (
        <p className="rounded-card border border-dashed border-line bg-white p-6 text-center text-sm text-warm-gray">
          No homes to compare yet &mdash; add your first listing below.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {comparing.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-card border border-line bg-white"
            >
              <PropertyThumb imageUrl={p.imageUrl} alt={propertyLabel(p)} className="h-40 w-full" />
              <div className="space-y-2 p-4">
                <p className="font-bold text-charcoal">{propertyLabel(p)}</p>
                <p className="text-sm text-warm-gray">
                  {p.price ? formatCurrency(p.price) : "Price not listed"}
                </p>
                {p.notes && <p className="text-sm italic text-warm-gray">{p.notes}</p>}
                <div className="flex items-center gap-3 pt-2">
                  {p.listingUrl && (
                    <a
                      href={p.listingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-terracotta hover:underline"
                    >
                      View listing
                    </a>
                  )}
                </div>
                <form action={startOfferAsClient.bind(null, data.shareToken, p.id)}>
                  <button
                    type="submit"
                    className="mt-2 w-full rounded-pill bg-terracotta px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Start an offer on this home
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddPropertyForm token={data.shareToken} />
    </div>
  );
}
