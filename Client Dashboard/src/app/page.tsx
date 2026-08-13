import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
      <h1 className="font-serif text-3xl font-semibold text-charcoal">
        Buyer Led Representation
      </h1>
      <p className="max-w-md text-warm-gray">
        Client dashboards live at a private link shared by your agent. If
        you&apos;re the agent, log in to the admin area to manage
        transactions.
      </p>
      <Link
        href="/admin"
        className="rounded-pill bg-terracotta px-6 py-2.5 font-semibold text-white transition hover:opacity-90"
      >
        Go to admin
      </Link>
    </div>
  );
}
