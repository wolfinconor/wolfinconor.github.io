export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream px-6 text-center">
      <h1 className="font-serif text-2xl font-semibold text-charcoal">
        Dashboard not found
      </h1>
      <p className="max-w-sm text-warm-gray">
        This link isn&apos;t valid. Double-check the URL your agent shared
        with you, or reach out to them directly.
      </p>
    </div>
  );
}
