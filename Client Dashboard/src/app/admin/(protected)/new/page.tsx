import { createClient } from "../actions";

export default function NewClientPage() {
  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-bold text-charcoal">New client</h1>
      <form action={createClient} className="space-y-4 rounded-card border border-line bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-semibold text-charcoal">
            Client name(s)
          </label>
          <input
            name="name"
            required
            placeholder="Sarah & Jordan"
            className="w-full rounded-[10px] border border-line px-3 py-2 outline-none focus:border-terracotta"
          />
        </div>
        <button
          type="submit"
          className="rounded-pill bg-terracotta px-6 py-2.5 font-semibold text-white hover:opacity-90"
        >
          Create client
        </button>
      </form>
    </div>
  );
}
