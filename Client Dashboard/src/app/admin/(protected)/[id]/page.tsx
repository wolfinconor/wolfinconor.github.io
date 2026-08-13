import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { transactionInclude } from "@/lib/serialize";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";
import { AutoSubmitCheckbox } from "@/components/admin/AutoSubmitCheckbox";
import {
  updateTransaction,
  deleteTransaction,
  addTimelineStep,
  updateTimelineStep,
  deleteTimelineStep,
  moveTimelineStep,
  addNextStep,
  toggleNextStep,
  deleteNextStep,
  addCostItem,
  updateCostItem,
  deleteCostItem,
  addTodoItem,
  toggleTodoItem,
  deleteTodoItem,
} from "../actions";

const inputClass =
  "w-full rounded-[10px] border border-line px-3 py-2 text-sm outline-none focus:border-terracotta";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export const dynamic = "force-dynamic";

export default async function EditTransactionPage({
  params,
}: {
  params: { id: string };
}) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: params.id },
    include: transactionInclude,
  });

  if (!transaction) {
    notFound();
  }

  const id = transaction.id;
  const dashboardUrl = `/dashboard/${transaction.shareToken}`;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin" className="text-sm font-semibold text-warm-gray hover:text-terracotta">
          &larr; All transactions
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-white p-6">
        <div>
          <p className="text-sm font-semibold text-warm-gray">Client share link</p>
          <p className="font-mono text-sm text-charcoal">{dashboardUrl}</p>
        </div>
        <div className="flex gap-3">
          <a
            href={dashboardUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-pill border border-line px-4 py-1.5 text-sm font-semibold text-charcoal hover:border-terracotta"
          >
            View as client
          </a>
          <CopyLinkButton url={dashboardUrl} />
        </div>
      </div>

      <section className="rounded-card border border-line bg-white p-6">
        <h2 className="mb-4 font-bold text-charcoal">Transaction details</h2>
        <form action={updateTransaction.bind(null, id)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-charcoal">
              Client name(s)
            </label>
            <input
              name="clientNames"
              defaultValue={transaction.clientNames}
              required
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-charcoal">
                Property address
              </label>
              <input
                name="propertyAddress"
                defaultValue={transaction.propertyAddress}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-charcoal">
                City, state
              </label>
              <input
                name="propertyCity"
                defaultValue={transaction.propertyCity}
                required
                className={inputClass}
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
                defaultValue={toDateInputValue(transaction.offerAcceptedDate)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-charcoal">
                Target closing date
              </label>
              <input
                type="date"
                name="targetClosingDate"
                defaultValue={toDateInputValue(transaction.targetClosingDate)}
                required
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-charcoal">
              Current status label
            </label>
            <input
              name="currentStatusLabel"
              defaultValue={transaction.currentStatusLabel}
              required
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="rounded-pill bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Save details
          </button>
        </form>
      </section>

      <section className="rounded-card border border-line bg-white p-6">
        <h2 className="mb-4 font-bold text-charcoal">Transaction timeline</h2>
        <div className="space-y-3">
          {transaction.timelineSteps.map((step, index) => (
            <form
              key={step.id}
              action={updateTimelineStep.bind(null, id, step.id)}
              className="flex flex-wrap items-center gap-2 border-b border-line pb-3 last:border-0"
            >
              <input name="label" defaultValue={step.label} className={`${inputClass} flex-1 min-w-[10rem]`} />
              <input name="date" defaultValue={step.date} className={`${inputClass} w-32`} />
              <select name="status" defaultValue={step.status} className={`${inputClass} w-32`}>
                <option value="upcoming">Upcoming</option>
                <option value="current">Current</option>
                <option value="done">Done</option>
              </select>
              <button
                type="submit"
                className="rounded-pill border border-terracotta px-3 py-1.5 text-xs font-semibold text-terracotta hover:bg-terracotta-pale"
              >
                Save
              </button>
              <div className="flex gap-1">
                <button
                  formAction={moveTimelineStep.bind(null, id, step.id, "up")}
                  disabled={index === 0}
                  className="rounded-[6px] border border-line px-2 py-1.5 text-xs text-charcoal disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  formAction={moveTimelineStep.bind(null, id, step.id, "down")}
                  disabled={index === transaction.timelineSteps.length - 1}
                  className="rounded-[6px] border border-line px-2 py-1.5 text-xs text-charcoal disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  formAction={deleteTimelineStep.bind(null, id, step.id)}
                  className="rounded-[6px] border border-line px-2 py-1.5 text-xs text-warm-gray hover:border-terracotta hover:text-terracotta"
                >
                  Delete
                </button>
              </div>
            </form>
          ))}
        </div>
        <form action={addTimelineStep.bind(null, id)} className="mt-4 flex flex-wrap items-center gap-2">
          <input name="label" placeholder="Step label" required className={`${inputClass} flex-1 min-w-[10rem]`} />
          <input name="date" placeholder="e.g. Aug 20" required className={`${inputClass} w-32`} />
          <select name="status" defaultValue="upcoming" className={`${inputClass} w-32`}>
            <option value="upcoming">Upcoming</option>
            <option value="current">Current</option>
            <option value="done">Done</option>
          </select>
          <button
            type="submit"
            className="rounded-pill bg-sage px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
          >
            + Add step
          </button>
        </form>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-card border border-line bg-white p-6">
          <h2 className="mb-4 font-bold text-charcoal">Next steps</h2>
          <div className="space-y-3">
            {transaction.nextSteps.map((step) => (
              <form
                key={step.id}
                action={toggleNextStep.bind(null, id, step.id)}
                className="flex items-start gap-2 border-b border-line pb-3 last:border-0"
              >
                <AutoSubmitCheckbox name="done" defaultChecked={step.status === "done"} />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-charcoal">{step.text}</p>
                  <p className="text-xs text-warm-gray">{step.dueDate}</p>
                </div>
                <button
                  formAction={deleteNextStep.bind(null, id, step.id)}
                  className="text-xs text-warm-gray hover:text-terracotta"
                >
                  Delete
                </button>
              </form>
            ))}
          </div>
          <form action={addNextStep.bind(null, id)} className="mt-4 space-y-2">
            <input name="text" placeholder="Task" required className={inputClass} />
            <input name="dueDate" placeholder="Due date text" required className={inputClass} />
            <button
              type="submit"
              className="w-full rounded-pill bg-sage px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              + Add next step
            </button>
          </form>
        </section>

        <section className="rounded-card border border-line bg-white p-6">
          <h2 className="mb-4 font-bold text-charcoal">Costs &amp; dates</h2>
          <div className="space-y-3">
            {transaction.costItems.map((cost) => (
              <form
                key={cost.id}
                action={updateCostItem.bind(null, id, cost.id)}
                className="space-y-1 border-b border-line pb-3 last:border-0"
              >
                <input name="label" defaultValue={cost.label} className={inputClass} />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="amount"
                    defaultValue={cost.amount}
                    className={`${inputClass} flex-1`}
                  />
                  <label className="flex items-center gap-1 text-xs text-warm-gray">
                    <input type="checkbox" name="isTotal" defaultChecked={cost.isTotal} />
                    Total row
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-pill border border-terracotta px-3 py-1 text-xs font-semibold text-terracotta hover:bg-terracotta-pale"
                  >
                    Save
                  </button>
                  <button
                    formAction={deleteCostItem.bind(null, id, cost.id)}
                    className="text-xs text-warm-gray hover:text-terracotta"
                  >
                    Delete
                  </button>
                </div>
              </form>
            ))}
          </div>
          <form action={addCostItem.bind(null, id)} className="mt-4 space-y-2">
            <input name="label" placeholder="Label" required className={inputClass} />
            <input type="number" name="amount" placeholder="Amount" required className={inputClass} />
            <label className="flex items-center gap-1 text-xs text-warm-gray">
              <input type="checkbox" name="isTotal" />
              Total row
            </label>
            <button
              type="submit"
              className="w-full rounded-pill bg-sage px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              + Add cost item
            </button>
          </form>
        </section>

        <section className="rounded-card border border-line bg-white p-6">
          <h2 className="mb-4 font-bold text-charcoal">To-do</h2>
          <div className="space-y-3">
            {transaction.todoItems.map((todo) => (
              <form
                key={todo.id}
                action={toggleTodoItem.bind(null, id, todo.id)}
                className="flex items-start gap-2 border-b border-line pb-3 last:border-0"
              >
                <AutoSubmitCheckbox name="done" defaultChecked={todo.status === "done"} />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-charcoal">{todo.text}</p>
                  <p className="text-xs text-warm-gray">{todo.assignedTo}</p>
                </div>
                <button
                  formAction={deleteTodoItem.bind(null, id, todo.id)}
                  className="text-xs text-warm-gray hover:text-terracotta"
                >
                  Delete
                </button>
              </form>
            ))}
          </div>
          <form action={addTodoItem.bind(null, id)} className="mt-4 space-y-2">
            <input name="text" placeholder="Task" required className={inputClass} />
            <input name="assignedTo" placeholder="Assigned to" required className={inputClass} />
            <button
              type="submit"
              className="w-full rounded-pill bg-sage px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              + Add to-do
            </button>
          </form>
        </section>
      </div>

      <section className="rounded-card border border-terracotta-light bg-terracotta-pale p-6">
        <h2 className="mb-2 font-bold text-charcoal">Delete transaction</h2>
        <p className="mb-4 text-sm text-warm-gray">
          This permanently removes the transaction and its client dashboard link. This can&apos;t be undone.
        </p>
        <form action={deleteTransaction.bind(null, id)}>
          <button
            type="submit"
            className="rounded-pill bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Delete transaction
          </button>
        </form>
      </section>
    </div>
  );
}
