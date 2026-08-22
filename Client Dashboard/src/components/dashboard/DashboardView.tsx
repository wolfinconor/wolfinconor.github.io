import type { PropertyData } from "@/lib/types";
import { PropertyBar } from "./PropertyBar";
import { Timeline } from "./Timeline";
import { NextStepsCard } from "./NextStepsCard";
import { CostsCard } from "./CostsCard";
import { TodoCard } from "./TodoCard";
import { OfferTermsEditToggle } from "./OfferTermsEditToggle";

export function DashboardView({
  token,
  property,
}: {
  token: string;
  property: PropertyData;
}) {
  return (
    <div className="space-y-8">
      <PropertyBar
        address={property.address}
        city={property.city}
        offerAcceptedDate={property.offerAcceptedDate}
        targetClosingDate={property.targetClosingDate}
        statusLabel={property.currentStatusLabel}
      />

      <OfferTermsEditToggle token={token} property={property} />

      <Timeline steps={property.timelineSteps} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <NextStepsCard items={property.nextSteps} />
        <CostsCard items={property.costItems} />
        <TodoCard items={property.todoItems} />
      </div>

      <p className="text-center text-sm italic text-warm-gray">
        Every buyer gets a dashboard like this &mdash; updated the moment
        something changes, so you&apos;re never left wondering what&apos;s
        next.
      </p>
    </div>
  );
}
