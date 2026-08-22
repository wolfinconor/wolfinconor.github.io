import type { PropertyData } from "@/lib/types";
import { OfferTermsFields } from "./OfferTermsFields";
import { saveOfferTermsAsClient } from "@/app/dashboard/[token]/actions";

export function OfferBuilderForm({
  token,
  property,
}: {
  token: string;
  property: PropertyData;
}) {
  return (
    <section className="rounded-card border border-line bg-white p-6">
      <h2 className="mb-1 font-bold text-charcoal">Build your offer</h2>
      <p className="mb-6 text-sm text-warm-gray">
        Set the terms you want to offer on this home. We&apos;ll turn this
        into your cost breakdown and timeline &mdash; you can come back and
        adjust it any time.
      </p>
      <form
        action={saveOfferTermsAsClient.bind(null, token, property.id)}
        className="space-y-6"
      >
        <OfferTermsFields defaultValues={property.offerTerms} suggestedPrice={property.price} />
        <button
          type="submit"
          className="rounded-pill bg-terracotta px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          {property.offerTerms ? "Update my offer" : "Save my offer"}
        </button>
      </form>
    </section>
  );
}
