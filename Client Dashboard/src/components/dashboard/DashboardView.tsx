import type { TransactionData } from "@/lib/types";
import { DashboardHeader } from "./DashboardHeader";
import { PropertyBar } from "./PropertyBar";
import { Timeline } from "./Timeline";
import { NextStepsCard } from "./NextStepsCard";
import { CostsCard } from "./CostsCard";
import { TodoCard } from "./TodoCard";

export function DashboardView({ transaction }: { transaction: TransactionData }) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="space-y-8">
          <DashboardHeader clientNames={transaction.clientNames} />

          <PropertyBar
            address={transaction.propertyAddress}
            city={transaction.propertyCity}
            offerAcceptedDate={transaction.offerAcceptedDate}
            targetClosingDate={transaction.targetClosingDate}
            statusLabel={transaction.currentStatusLabel}
          />

          <Timeline steps={transaction.timelineSteps} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <NextStepsCard items={transaction.nextSteps} />
            <CostsCard items={transaction.costItems} />
            <TodoCard items={transaction.todoItems} />
          </div>

          <p className="text-center text-sm italic text-warm-gray">
            Every buyer gets a dashboard like this &mdash; updated the moment
            something changes, so you&apos;re never left wondering
            what&apos;s next.
          </p>
        </div>
      </div>
    </div>
  );
}
