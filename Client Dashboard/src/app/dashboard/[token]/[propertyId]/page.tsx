import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeProperty, propertyInclude } from "@/lib/serialize";
import { propertyLabel, formatCurrency } from "@/lib/types";
import { PropertyThumb } from "@/components/dashboard/PropertyThumb";
import { StarButton } from "@/components/dashboard/StarButton";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { startOfferAsClient, removePropertyAsClient } from "../actions";

export const dynamic = "force-dynamic";

export default async function ClientPropertyPage({
  params,
}: {
  params: { token: string; propertyId: string };
}) {
  const client = await prisma.client.findUnique({
    where: { shareToken: params.token },
  });

  if (!client) {
    notFound();
  }

  const property = await prisma.property.findUnique({
    where: { id: params.propertyId },
    include: propertyInclude,
  });

  if (!property || property.clientId !== client.id) {
    notFound();
  }

  const data = serializeProperty(property);

  if (data.status !== "comparing") {
    return <DashboardView property={data} />;
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-card border border-line bg-white">
        <div className="relative">
          <PropertyThumb imageUrl={data.imageUrl} alt={propertyLabel(data)} className="h-64 w-full" />
          <div className="absolute right-4 top-4">
            <StarButton token={params.token} propertyId={data.id} isFavorite={data.isFavorite} />
          </div>
        </div>
        <div className="space-y-3 p-6">
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            {propertyLabel(data)}
          </h1>
          <p className="text-warm-gray">
            {data.price ? formatCurrency(data.price) : "Price not listed"}
          </p>
          {data.notes && <p className="italic text-warm-gray">{data.notes}</p>}
          {data.listingUrl && (
            <a
              href={data.listingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm font-semibold text-terracotta hover:underline"
            >
              View original listing &rarr;
            </a>
          )}
          <div className="flex flex-wrap gap-3 pt-3">
            <form action={startOfferAsClient.bind(null, params.token, data.id)}>
              <button
                type="submit"
                className="rounded-pill bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Start an offer on this home
              </button>
            </form>
            <form action={removePropertyAsClient.bind(null, params.token, data.id)}>
              <button
                type="submit"
                className="rounded-pill border border-line px-5 py-2 text-sm font-semibold text-charcoal hover:border-terracotta"
              >
                Remove from my list
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
