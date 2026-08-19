"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropertyData } from "@/lib/types";
import { propertyLabel, formatCurrency } from "@/lib/types";
import { PropertyThumb } from "./PropertyThumb";
import { removePropertyAsClient } from "@/app/dashboard/[token]/actions";

const STATUS_LABELS: Record<string, string> = {
  comparing: "Comparing",
  active: "In progress",
  closed: "Closed",
};

export function PropertySidebar({
  token,
  properties,
}: {
  token: string;
  properties: PropertyData[];
}) {
  const pathname = usePathname();
  const activePropertyId = pathname?.split("/")[3];

  return (
    <aside className="space-y-3">
      <Link
        href={`/dashboard/${token}`}
        className={`block rounded-[10px] border px-3 py-2 text-sm font-semibold ${
          !activePropertyId
            ? "border-terracotta bg-terracotta-pale text-terracotta"
            : "border-line bg-white text-charcoal hover:border-terracotta"
        }`}
      >
        Compare all homes
      </Link>

      <div className="space-y-2">
        {properties.length === 0 && (
          <p className="rounded-[10px] border border-dashed border-line p-3 text-xs text-warm-gray">
            No homes added yet.
          </p>
        )}
        {properties.map((property) => (
          <div
            key={property.id}
            className={`overflow-hidden rounded-[10px] border ${
              property.id === activePropertyId
                ? "border-terracotta"
                : "border-line"
            } bg-white`}
          >
            <Link
              href={`/dashboard/${token}/${property.id}`}
              className="flex items-center gap-3 p-2"
            >
              <PropertyThumb
                imageUrl={property.imageUrl}
                alt={propertyLabel(property)}
                className="h-12 w-14 shrink-0 rounded-[6px]"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-charcoal">
                  {propertyLabel(property)}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-warm-gray">
                    {property.price ? formatCurrency(property.price) : "No price"}
                  </span>
                  <span className="rounded-pill bg-sage-pale px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-sage-dark">
                    {STATUS_LABELS[property.status] ?? property.status}
                  </span>
                </div>
              </div>
            </Link>
            {property.status === "comparing" && (
              <form
                action={removePropertyAsClient.bind(null, token, property.id)}
                className="border-t border-line px-2 py-1"
              >
                <button
                  type="submit"
                  className="text-xs text-warm-gray hover:text-terracotta"
                >
                  Remove
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
