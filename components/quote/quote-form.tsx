"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitQuoteRequest, type QuoteFormState } from "@/app/quote/actions";
import { quoteContent } from "@/lib/content/quote";

const initialState: QuoteFormState = { status: "idle", errors: {}, message: "" };

const FIELD_STYLE =
  "mt-2 w-full rounded-lg border border-white/10 bg-graphite-800 px-4 py-3 text-steel-100 placeholder:text-steel-200/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2";
const LABEL_STYLE = "block text-sm font-medium text-steel-100";
const ERROR_STYLE = "mt-1 text-sm text-red-400";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
    >
      {pending ? "Submitting…" : "Submit Quote Request"}
    </button>
  );
}

export function QuoteForm() {
  const [state, formAction] = useActionState(submitQuoteRequest, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-steel-100">Request received.</h2>
        <p className="mt-2 text-steel-200">{state.message}</p>
      </div>
    );
  }

  if (state.status === "unavailable") {
    return (
      <div className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-steel-100">Almost there.</h2>
        <p className="mt-2 text-steel-200">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12"
    >
      <p className="text-sm text-accent-400">{quoteContent.slaStatement}</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={LABEL_STYLE}>
            Name
          </label>
          <input id="name" name="name" type="text" required className={FIELD_STYLE} />
          {state.errors.name && <p className={ERROR_STYLE}>{state.errors.name[0]}</p>}
        </div>
        <div>
          <label htmlFor="email" className={LABEL_STYLE}>
            Email
          </label>
          <input id="email" name="email" type="email" required className={FIELD_STYLE} />
          {state.errors.email && <p className={ERROR_STYLE}>{state.errors.email[0]}</p>}
        </div>
        <div>
          <label htmlFor="company" className={LABEL_STYLE}>
            Company
          </label>
          <input id="company" name="company" type="text" className={FIELD_STYLE} />
        </div>
        <div>
          <label htmlFor="material" className={LABEL_STYLE}>
            Material
          </label>
          <select id="material" name="material" required defaultValue="" className={FIELD_STYLE}>
            <option value="" disabled>
              Select a material
            </option>
            {quoteContent.materials.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
          {state.errors.material && <p className={ERROR_STYLE}>{state.errors.material[0]}</p>}
        </div>
        <div>
          <label htmlFor="quantity" className={LABEL_STYLE}>
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            required
            className={FIELD_STYLE}
          />
          {state.errors.quantity && <p className={ERROR_STYLE}>{state.errors.quantity[0]}</p>}
        </div>
        <div>
          <label htmlFor="timeline" className={LABEL_STYLE}>
            Timeline
          </label>
          <select id="timeline" name="timeline" required defaultValue="" className={FIELD_STYLE}>
            <option value="" disabled>
              Select a timeline
            </option>
            {quoteContent.timelines.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
          {state.errors.timeline && <p className={ERROR_STYLE}>{state.errors.timeline[0]}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="certRequirement" className={LABEL_STYLE}>
            Certification requirement
          </label>
          <select
            id="certRequirement"
            name="certRequirement"
            required
            defaultValue=""
            className={FIELD_STYLE}
          >
            <option value="" disabled>
              Select a certification requirement
            </option>
            {quoteContent.certRequirements.map((cert) => (
              <option key={cert} value={cert}>
                {cert}
              </option>
            ))}
          </select>
          {state.errors.certRequirement && (
            <p className={ERROR_STYLE}>{state.errors.certRequirement[0]}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes" className={LABEL_STYLE}>
            Notes (optional)
          </label>
          <textarea id="notes" name="notes" rows={4} className={FIELD_STYLE} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="file" className={LABEL_STYLE}>
            Drawing or model file
          </label>
          <input
            id="file"
            name="file"
            type="file"
            required
            accept={quoteContent.acceptedFileExtensions.join(",")}
            className={`${FIELD_STYLE} file:mr-4 file:rounded-full file:border-0 file:bg-accent-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white`}
          />
          <p className="mt-2 text-sm text-steel-200">
            Accepted: {quoteContent.acceptedFileLabel}. Max {quoteContent.maxFileSizeLabel}.
          </p>
          {state.errors.file && <p className={ERROR_STYLE}>{state.errors.file[0]}</p>}
        </div>
      </div>

      {state.status === "error" && state.message && (
        <p className="mt-6 text-sm text-red-400" role="alert">
          {state.message}
        </p>
      )}

      <div className="mt-8">
        <SubmitButton />
      </div>
    </form>
  );
}
