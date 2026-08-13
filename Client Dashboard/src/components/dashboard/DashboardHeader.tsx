export function DashboardHeader({ clientNames }: { clientNames: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-terracotta text-cream">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 11.5L12 4l9 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.5 10v8.5A1.5 1.5 0 0 0 7 20h10a1.5 1.5 0 0 0 1.5-1.5V10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-lg font-bold leading-tight text-charcoal">
            Buyer Led Representation
          </p>
          <p className="text-sm italic text-warm-gray">
            Your transaction, tracked in real time
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-charcoal">Welcome back, {clientNames}</p>
        <p className="text-sm text-warm-gray">
          Conor Wolfin &middot; WA Licensee #25007529
        </p>
      </div>
    </header>
  );
}
