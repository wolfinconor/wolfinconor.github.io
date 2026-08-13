import type { TodoItemData } from "@/lib/types";

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

export function TodoCard({ items }: { items: TodoItemData[] }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-terracotta-pale text-terracotta">
          ✓
        </span>
        <h2 className="font-bold text-charcoal">To-Do</h2>
      </div>
      <p className="-mt-2 mb-4 text-sm text-warm-gray">
        Yours and ours, all in one place
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
                  className={
                    item.status === "done"
                      ? "text-warm-gray line-through decoration-warm-gray"
                      : "font-bold text-charcoal"
                  }
                >
                  {item.text}
                </p>
                <p className="text-sm text-warm-gray">{item.assignedTo}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
