import { addPropertyAsClient } from "@/app/dashboard/[token]/actions";

export function AddPropertyForm({ token }: { token: string }) {
  return (
    <form
      action={addPropertyAsClient.bind(null, token)}
      className="flex flex-wrap items-end gap-3 rounded-card border border-line bg-white p-6"
    >
      <div className="flex-1 min-w-[16rem]">
        <label className="mb-1 block text-sm font-semibold text-charcoal">
          Add a home you&apos;re considering
        </label>
        <input
          name="listingUrl"
          required
          placeholder="Paste a Zillow, Redfin, or Homes.com link"
          className="w-full rounded-[10px] border border-line px-3 py-2 text-sm outline-none focus:border-terracotta"
        />
      </div>
      <div className="flex-1 min-w-[12rem]">
        <label className="mb-1 block text-sm font-semibold text-charcoal">
          Notes (optional)
        </label>
        <input
          name="notes"
          placeholder="What you liked about it"
          className="w-full rounded-[10px] border border-line px-3 py-2 text-sm outline-none focus:border-terracotta"
        />
      </div>
      <button
        type="submit"
        className="rounded-pill bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        + Add home
      </button>
    </form>
  );
}
