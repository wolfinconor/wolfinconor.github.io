import { formatDateShort } from "@/lib/types";

export function PropertyBar({
  address,
  city,
  offerAcceptedDate,
  targetClosingDate,
  statusLabel,
}: {
  address: string | null;
  city: string | null;
  offerAcceptedDate: string | null;
  targetClosingDate: string | null;
  statusLabel: string | null;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-white p-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          {address ?? "Address TBD"}
          {city ? `, ${city}` : ""}
        </h1>
        <p className="mt-1 text-sm text-warm-gray">
          Offer accepted {formatDateShort(offerAcceptedDate)} &middot; Target
          closing {formatDateShort(targetClosingDate)}
        </p>
      </div>
      <span className="rounded-pill bg-sage-pale px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-sage-dark">
        {statusLabel ?? "Getting Started"}
      </span>
    </div>
  );
}
