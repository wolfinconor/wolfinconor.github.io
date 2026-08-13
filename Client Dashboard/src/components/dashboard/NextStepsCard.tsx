import type { NextStepData } from "@/lib/types";

function Checkbox({ done }: { done: boolean }) {
  if (done) {
    return (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-sage text-white">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  return <div className="h-5 w-5 shrink-0 rounded-[5px] border-2 border-terracotta-light" />;
}

export function NextStepsCard({ items }: { items: NextStepData[] }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-terracotta-pale text-terracotta">
          ★
        </span>
        <h2 className="font-bold text-charcoal">Next Steps</h2>
      </div>
      <p className="-mt-2 mb-4 text-sm text-warm-gray">
        What needs your attention right now
      </p>
      <ul className="space-y-4">
        {sorted.map((item, index) => (
          <li
            key={item.id}
            className={
              index < sorted.length - 1 ? "border-b border-line pb-4" : ""
            }
          >
            <div className="flex items-start gap-3">
              <Checkbox done={item.status === "done"} />
              <div>
                <p
                  className={`font-bold ${
                    item.status === "done" ? "text-warm-gray" : "text-charcoal"
                  }`}
                >
                  {item.text}
                </p>
                <p
                  className={`text-sm ${
                    item.status === "done" ? "text-sage-dark" : "text-terracotta"
                  }`}
                >
                  {item.dueDate}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
