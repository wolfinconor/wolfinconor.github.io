import type { TimelineStepData } from "@/lib/types";

function StepMarker({ step, index }: { step: TimelineStepData; index: number }) {
  if (step.status === "done") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  if (step.status === "current") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-terracotta bg-white text-terracotta shadow-[0_0_0_6px_rgba(193,112,79,0.15)]">
        <span className="text-sm font-bold">{index + 1}</span>
      </div>
    );
  }
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-line bg-white text-warm-gray">
      <span className="text-sm font-bold">{index + 1}</span>
    </div>
  );
}

export function Timeline({ steps }: { steps: TimelineStepData[] }) {
  const sorted = [...steps].sort((a, b) => a.order - b.order);

  return (
    <div>
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-terracotta">
        Transaction Timeline
      </p>
      <div className="flex items-start">
        {sorted.map((step, index) => (
          <div key={step.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center text-center">
              <StepMarker step={step} index={index} />
              <p className="mt-2 max-w-[7rem] text-sm font-bold text-charcoal">
                {step.label}
              </p>
              <p className="text-xs text-warm-gray">{step.date}</p>
            </div>
            {index < sorted.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 self-start mt-[22px] ${
                  step.status === "done" ? "bg-terracotta" : "bg-line"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
