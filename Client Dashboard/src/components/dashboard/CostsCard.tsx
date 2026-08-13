import type { CostItemData } from "@/lib/types";
import { formatCurrency } from "@/lib/types";

export function CostsCard({ items }: { items: CostItemData[] }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage-pale text-sage-dark">
          $
        </span>
        <h2 className="font-bold text-charcoal">Costs &amp; Dates</h2>
      </div>
      <p className="-mt-2 mb-4 text-sm text-warm-gray">
        Everything accounted for, nothing hidden
      </p>
      <ul>
        {sorted.map((item) => (
          <li
            key={item.id}
            className={
              item.isTotal
                ? "flex items-center justify-between border-t-2 border-charcoal pt-3 mt-2"
                : "flex items-center justify-between border-b border-line py-3 first:pt-0"
            }
          >
            <span className={item.isTotal ? "font-bold text-charcoal" : "text-charcoal"}>
              {item.label}
            </span>
            <span
              className={`tabular-nums ${
                item.isTotal ? "font-bold text-charcoal" : "font-semibold text-charcoal"
              }`}
            >
              {formatCurrency(item.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
