import { createTransaction } from "../actions";

export default function NewTransactionPage() {
  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-bold text-charcoal">New transaction</h1>
      <form action={createTransaction} className="space-y-4 rounded-card border border-line bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-semibold text-charcoal">
            Client name(s)
          </label>
          <input
            name="clientNames"
            required
            placeholder="Sarah & Jordan"
            className="w-full rounded-[10px] border border-line px-3 py-2 outline-none focus:border-terracotta"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-charcoal">
              Property address
            </label>
            <input
              name="propertyAddress"
              required
              placeholder="4127 Maple Street"
              className="w-full rounded-[10px] border border-line px-3 py-2 outline-none focus:border-terracotta"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-charcoal">
              City, state
            </label>
            <input
              name="propertyCity"
              required
              placeholder="Tacoma, WA"
              className="w-full rounded-[10px] border border-line px-3 py-2 outline-none focus:border-terracotta"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-charcoal">
              Offer accepted date
            </label>
            <input
              type="date"
              name="offerAcceptedDate"
              required
              className="w-full rounded-[10px] border border-line px-3 py-2 outline-none focus:border-terracotta"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-charcoal">
              Target closing date
            </label>
            <input
              type="date"
              name="targetClosingDate"
              required
              className="w-full rounded-[10px] border border-line px-3 py-2 outline-none focus:border-terracotta"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-charcoal">
            Current status label
          </label>
          <input
            name="currentStatusLabel"
            required
            placeholder="Inspection Period"
            className="w-full rounded-[10px] border border-line px-3 py-2 outline-none focus:border-terracotta"
          />
        </div>
        <button
          type="submit"
          className="rounded-pill bg-terracotta px-6 py-2.5 font-semibold text-white hover:opacity-90"
        >
          Create transaction
        </button>
      </form>
    </div>
  );
}
