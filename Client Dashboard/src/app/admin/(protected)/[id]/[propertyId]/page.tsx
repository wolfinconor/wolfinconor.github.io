import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { propertyInclude } from "@/lib/serialize";
import { propertyLabel } from "@/lib/types";
import { AutoSubmitCheckbox } from "@/components/admin/AutoSubmitCheckbox";
import {
  updateProperty,
  deleteProperty,
  promoteToOffer,
  setPropertyStatus,
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
} from "../../actions";

const inputClass =
  "w-full rounded-[10px] border border-line px-3 py-2 text-sm outline-none focus:border-terracotta";

function toDateInputValue(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export const dynamic = "force-dynamic";

export default async function PropertyPage({
  params,
}: {
  params: { id: string; propertyId: string };
}) {
  const property = await prisma.property.findUnique({
    where: { id: params.propertyId },
    include: propertyInclude,
  });

  if (!property || property.clientId !== params.id) {
    notFound();
  }

  const clientId = params.id;
  const propertyId = property.id;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/admin/${clientId}`}
          className="text-sm font-semibold text-warm-gray hover:text-terracotta"
        >
          &larr; Back to homes
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-white p-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            {propertyLabel(property)}
          </h1>
          <p className="mt-1 text-sm text-warm-gray">
            Status:{" "}
            <span className="font-semibold text-charcoal">{property.status}</span>
          </p>
        </div>
        <form action={setPropertyStatus.bind(null, clientId, propertyId)} className="flex gap-2">
          <select name="status" defaultValue={property.status} className={`${inputClass} w-40`}>
            <option value="comparing">Comparing</option>
            <option value="active">Active offer</option>
            <option value="closed">Closed</option>
          </select>
          <button
            type="submit"
            className="rounded-pill border border-terracotta px-4 py-1.5 text-sm font-semibold text-terracotta hover:bg-terracotta-pale"
          >
            Update status
          </button>
        </form>
      </div>

      <section className="rounded-card border border-line bg-white p-6">
        <h2 className="mb-4 font-bold text-charcoal">Listing details</h2>
        <form action={updateProperty.bind(null, clientId, propertyId)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-charcoal">
              Listing link (Zillow / Redfin / Homes.com)
            </label>
            <input
              name="listingUrl"
              defaultValue={property.listingUrl ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-charcoal">
              Thumbnail image URL (auto-pulled from the listing; override here if needed)
            </label>
            <input
              name="imageUrl"
              defaultValue={property.imageUrl ?? ""}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-charcoal">
                Address
              </label>
              <input
                name="address"
                defaultValue={property.address ?? ""}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-charcoal">
                City, state
              </label>
              <input name="city" defaultValue={property.city ?? ""} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-charcoal">
                List price
              </label>
              <input
                type="number"
                name="price"
                defaultValue={property.price ?? ""}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-charcoal">
                Notes
              </label>
              <input name="notes" defaultValue={property.notes ?? ""} className={inputClass} />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-pill bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Save details
          </button>
        </form>
      </section>

      {property.status === "comparing" ? (
        <section className="rounded-card border border-sage bg-sage-pale p-6">
          <h2 className="mb-2 font-bold text-charcoal">Move to active offer</h2>
          <p className="mb-4 text-sm text-warm-gray">
            The client can also do this themselves from their dashboard. Once active,
            this home gets the full timeline / costs / to-do tracker below.
          </p>
          <form
            action={promoteToOffer.bind(null, clientId, propertyId)}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <div>
              <label className="mb-1 block text-sm font-semibold text-charcoal">
                Offer accepted date
              </label>
              <input type="date" name="offerAcceptedDate" className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-charcoal">
                Target closing date
              </label>
              <input type="date" name="targetClosingDate" className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-charcoal">
                Status label
              </label>
              <input
                name="currentStatusLabel"
                placeholder="Inspection Period"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              className="sm:col-span-3 rounded-pill bg-sage-dark px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Start offer
            </button>
          </form>
        </section>
      ) : (
        <>
          <section className="rounded-card border border-line bg-white p-6">
            <h2 className="mb-4 font-bold text-charcoal">Offer details</h2>
            <form
              action={promoteToOffer.bind(null, clientId, propertyId)}
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              <div>
                <label className="mb-1 block text-sm font-semibold text-charcoal">
                  Offer accepted date
                </label>
                <input
                  type="date"
                  name="offerAcceptedDate"
                  defaultValue={toDateInputValue(property.offerAcceptedDate)}
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
                  defaultValue={toDateInputValue(property.targetClosingDate)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-charcoal">
                  Status label
                </label>
                <input
                  name="currentStatusLabel"
                  defaultValue={property.currentStatusLabel ?? ""}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                className="sm:col-span-3 rounded-pill bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Save offer details
              </button>
            </form>
          </section>

          <section className="rounded-card border border-line bg-white p-6">
            <h2 className="mb-4 font-bold text-charcoal">Timeline</h2>
            <div className="space-y-3">
              {property.timelineSteps.map((step, index) => (
                <form
                  key={step.id}
                  action={updateTimelineStep.bind(null, clientId, propertyId, step.id)}
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
                      formAction={moveTimelineStep.bind(null, clientId, propertyId, step.id, "up")}
                      disabled={index === 0}
                      className="rounded-[6px] border border-line px-2 py-1.5 text-xs text-charcoal disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      formAction={moveTimelineStep.bind(null, clientId, propertyId, step.id, "down")}
                      disabled={index === property.timelineSteps.length - 1}
                      className="rounded-[6px] border border-line px-2 py-1.5 text-xs text-charcoal disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      formAction={deleteTimelineStep.bind(null, clientId, propertyId, step.id)}
                      className="rounded-[6px] border border-line px-2 py-1.5 text-xs text-warm-gray hover:border-terracotta hover:text-terracotta"
                    >
                      Delete
                    </button>
                  </div>
                </form>
              ))}
            </div>
            <form
              action={addTimelineStep.bind(null, clientId, propertyId)}
              className="mt-4 flex flex-wrap items-center gap-2"
            >
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
                {property.nextSteps.map((step) => (
                  <form
                    key={step.id}
                    action={toggleNextStep.bind(null, clientId, propertyId, step.id)}
                    className="flex items-start gap-2 border-b border-line pb-3 last:border-0"
                  >
                    <AutoSubmitCheckbox name="done" defaultChecked={step.status === "done"} />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-charcoal">{step.text}</p>
                      <p className="text-xs text-warm-gray">{step.dueDate}</p>
                    </div>
                    <button
                      formAction={deleteNextStep.bind(null, clientId, propertyId, step.id)}
                      className="text-xs text-warm-gray hover:text-terracotta"
                    >
                      Delete
                    </button>
                  </form>
                ))}
              </div>
              <form action={addNextStep.bind(null, clientId, propertyId)} className="mt-4 space-y-2">
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
                {property.costItems.map((cost) => (
                  <form
                    key={cost.id}
                    action={updateCostItem.bind(null, clientId, propertyId, cost.id)}
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
                        formAction={deleteCostItem.bind(null, clientId, propertyId, cost.id)}
                        className="text-xs text-warm-gray hover:text-terracotta"
                      >
                        Delete
                      </button>
                    </div>
                  </form>
                ))}
              </div>
              <form action={addCostItem.bind(null, clientId, propertyId)} className="mt-4 space-y-2">
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
                {property.todoItems.map((todo) => (
                  <form
                    key={todo.id}
                    action={toggleTodoItem.bind(null, clientId, propertyId, todo.id)}
                    className="flex items-start gap-2 border-b border-line pb-3 last:border-0"
                  >
                    <AutoSubmitCheckbox name="done" defaultChecked={todo.status === "done"} />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-charcoal">{todo.text}</p>
                      <p className="text-xs text-warm-gray">{todo.assignedTo}</p>
                    </div>
                    <button
                      formAction={deleteTodoItem.bind(null, clientId, propertyId, todo.id)}
                      className="text-xs text-warm-gray hover:text-terracotta"
                    >
                      Delete
                    </button>
                  </form>
                ))}
              </div>
              <form action={addTodoItem.bind(null, clientId, propertyId)} className="mt-4 space-y-2">
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
        </>
      )}

      <section className="rounded-card border border-terracotta-light bg-terracotta-pale p-6">
        <h2 className="mb-2 font-bold text-charcoal">Remove this home</h2>
        <p className="mb-4 text-sm text-warm-gray">
          This permanently removes the home from the client&apos;s list. This can&apos;t be undone.
        </p>
        <form action={deleteProperty.bind(null, clientId, propertyId)}>
          <button
            type="submit"
            className="rounded-pill bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Remove home
          </button>
        </form>
      </section>
    </div>
  );
}
