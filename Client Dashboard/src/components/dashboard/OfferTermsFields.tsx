import type { OfferTermsData } from "@/lib/types";

const inputClass =
  "w-full rounded-[10px] border border-line px-3 py-2 text-sm outline-none focus:border-terracotta";

const labelClass = "mb-1 block text-sm font-semibold text-charcoal";

export function OfferTermsFields({
  defaultValues,
  suggestedPrice,
}: {
  defaultValues?: OfferTermsData | null;
  suggestedPrice?: number | null;
}) {
  const v = defaultValues;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">
          Offer basics
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div>
            <label className={labelClass}>Offer price</label>
            <input
              type="number"
              name="offerPrice"
              defaultValue={v?.offerPrice ?? suggestedPrice ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Earnest money</label>
            <input
              type="number"
              name="earnestMoney"
              defaultValue={v?.earnestMoney ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Financing</label>
            <select
              name="financingType"
              defaultValue={v?.financingType ?? "conventional"}
              className={inputClass}
            >
              <option value="cash">Cash</option>
              <option value="conventional">Conventional</option>
              <option value="fha">FHA</option>
              <option value="va">VA</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Down payment %</label>
            <input
              type="number"
              name="downPaymentPercent"
              defaultValue={v?.downPaymentPercent ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">
          Inspection &amp; appraisal
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-3 rounded-[10px] border border-line p-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <input
                type="checkbox"
                name="hasInspection"
                defaultChecked={v?.hasInspection ?? true}
              />
              Request an inspection
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Cost</label>
                <input
                  type="number"
                  name="inspectionCost"
                  defaultValue={v?.inspectionCost ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Period (days)</label>
                <input
                  type="number"
                  name="inspectionPeriodDays"
                  defaultValue={v?.inspectionPeriodDays ?? 10}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-[10px] border border-line p-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <input
                type="checkbox"
                name="hasAppraisal"
                defaultChecked={v?.hasAppraisal ?? true}
              />
              Request an appraisal
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Cost</label>
                <input
                  type="number"
                  name="appraisalCost"
                  defaultValue={v?.appraisalCost ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Period (days)</label>
                <input
                  type="number"
                  name="appraisalPeriodDays"
                  defaultValue={v?.appraisalPeriodDays ?? 14}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">
          Additional terms
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-3 rounded-[10px] border border-line p-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <input
                type="checkbox"
                name="hasHomeWarranty"
                defaultChecked={v?.hasHomeWarranty ?? false}
              />
              Request a home warranty
            </label>
            <div>
              <label className={labelClass}>Cost</label>
              <input
                type="number"
                name="homeWarrantyCost"
                defaultValue={v?.homeWarrantyCost ?? ""}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-3 rounded-[10px] border border-line p-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <input
                type="checkbox"
                name="hasEscalation"
                defaultChecked={v?.hasEscalation ?? false}
              />
              Include an escalation clause
            </label>
            <div>
              <label className={labelClass}>Cap</label>
              <input
                type="number"
                name="escalationCap"
                defaultValue={v?.escalationCap ?? ""}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Seller concessions requested</label>
            <input
              type="number"
              name="sellerConcessions"
              defaultValue={v?.sellerConcessions ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Est. closing costs</label>
            <input
              type="number"
              name="closingCostEstimate"
              defaultValue={v?.closingCostEstimate ?? ""}
              className={inputClass}
            />
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <input
                type="checkbox"
                name="saleContingency"
                defaultChecked={v?.saleContingency ?? false}
              />
              Contingent on sale of current home
            </label>
          </div>
        </div>

        <div className="mt-3">
          <label className={labelClass}>Personal property included</label>
          <input
            name="personalProperty"
            placeholder="e.g. washer, dryer, refrigerator"
            defaultValue={v?.personalProperty ?? ""}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
