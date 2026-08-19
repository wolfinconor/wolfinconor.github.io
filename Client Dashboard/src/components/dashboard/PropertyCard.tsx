import Link from "next/link";
import type { PropertyData } from "@/lib/types";
import { propertyLabel, formatCurrency } from "@/lib/types";
import { PropertyThumb } from "./PropertyThumb";
import { StarButton } from "./StarButton";
import { startOfferAsClient } from "@/app/dashboard/[token]/actions";

const STATUS_LABELS: Record<string, string> = {
  comparing: "Comparing",
  active: "In progress",
  closed: "Closed",
};

export function PropertyCard({
  token,
  property,
}: {
  token: string;
  property: PropertyData;
}) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-white">
      <div className="relative">
        <PropertyThumb
          imageUrl={property.imageUrl}
          alt={propertyLabel(property)}
          className="h-40 w-full"
        />
        <div className="absolute right-3 top-3">
          <StarButton
            token={token}
            propertyId={property.id}
            isFavorite={property.isFavorite}
          />
        </div>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-charcoal">{propertyLabel(property)}</p>
          <span className="shrink-0 rounded-pill bg-sage-pale px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage-dark">
            {STATUS_LABELS[property.status] ?? property.status}
          </span>
        </div>
        <p className="text-sm text-warm-gray">
          {property.price ? formatCurrency(property.price) : "Price not listed"}
        </p>
        {property.notes && <p className="text-sm italic text-warm-gray">{property.notes}</p>}
        {property.listingUrl && (
          <a
            href={property.listingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-xs font-semibold text-terracotta hover:underline"
          >
            View listing
          </a>
        )}
        {property.status === "comparing" ? (
          <form action={startOfferAsClient.bind(null, token, property.id)}>
            <button
              type="submit"
              className="mt-2 w-full rounded-pill bg-terracotta px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Start an offer on this home
            </button>
          </form>
        ) : (
          <Link
            href={`/dashboard/${token}/${property.id}`}
            className="mt-2 block w-full rounded-pill border border-line px-4 py-2 text-center text-sm font-semibold text-charcoal hover:border-terracotta"
          >
            View details
          </Link>
        )}
      </div>
    </div>
  );
}
