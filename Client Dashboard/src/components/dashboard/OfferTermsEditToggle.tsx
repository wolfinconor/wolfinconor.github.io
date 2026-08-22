"use client";

import { useState } from "react";
import type { PropertyData } from "@/lib/types";
import { OfferBuilderForm } from "./OfferBuilderForm";

export function OfferTermsEditToggle({
  token,
  property,
}: {
  token: string;
  property: PropertyData;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-terracotta hover:underline"
      >
        Edit offer terms
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-xs font-semibold text-warm-gray hover:text-terracotta"
      >
        &larr; Close
      </button>
      <OfferBuilderForm token={token} property={property} />
    </div>
  );
}
