import { z } from "zod";

export const ACCEPTED_FILE_EXTENSIONS = [
  ".step",
  ".stp",
  ".iges",
  ".igs",
  ".x_t",
  ".x_b",
  ".stl",
  ".pdf",
  ".dwg",
  ".dxf",
];

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

export function isAcceptedFileType(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ACCEPTED_FILE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export const quoteFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  company: z.string().trim().optional(),
  material: z.string().trim().min(1, "Select a material."),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  timeline: z.string().trim().min(1, "Select a timeline."),
  certRequirement: z.string().trim().min(1, "Select a certification requirement."),
  notes: z.string().trim().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
