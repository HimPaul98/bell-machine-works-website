"use server";

import { quoteFormSchema, MAX_FILE_SIZE_BYTES, isAcceptedFileType } from "@/lib/quote/validation";
import { quoteContent } from "@/lib/content/quote";

export interface QuoteFormState {
  status: "idle" | "success" | "error" | "unavailable";
  errors: Record<string, string[]>;
  message: string;
}

export async function submitQuoteRequest(
  _prevState: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  const parsed = quoteFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    material: formData.get("material"),
    quantity: formData.get("quantity"),
    timeline: formData.get("timeline"),
    certRequirement: formData.get("certRequirement"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: "Please fix the highlighted fields and try again.",
    };
  }

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return {
      status: "error",
      errors: { file: ["A drawing or model file is required."] },
      message: "Please attach a drawing or model file.",
    };
  }

  if (!isAcceptedFileType(file.name)) {
    return {
      status: "error",
      errors: {
        file: ["Unsupported file type. Accepted: STEP, IGES, Parasolid, STL, PDF, DWG, DXF."],
      },
      message: "Please attach a supported file type.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      status: "error",
      errors: { file: ["File is too large. Max 45MB."] },
      message: "Please attach a smaller file.",
    };
  }

  // Delivery (file upload + Resend notification) is deferred until hosting
  // and a storage provider are decided — see Task 3 and the phase-level
  // ruling above. The submission is fully validated but not yet sent
  // anywhere; return an honest "not live yet" state instead of a fake
  // success.
  return {
    status: "unavailable",
    errors: {},
    message: `Your request looks good, but online submission isn't live yet — we're finishing this feature. In the meantime, email your drawing and details directly to ${quoteContent.fallbackContactEmail} and we'll get you a quote.`,
  };
}
