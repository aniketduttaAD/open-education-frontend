"use client";

import { create } from "zustand";
import { z } from "zod";
// Document type is determined server-side; FE doesn't expose a selector

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
] as const;

export const VerificationDocSchema = z.object({
  name: z
    .string()
    .min(1, "Document name is required")
    .max(80, "Keep it under 80 characters"),
  description: z.string().max(160).optional().or(z.literal("")),
  files: z
    .array(z.custom<File>())
    .min(1, "Attach at least one file")
    .max(5, "Maximum 5 files per document")
    .refine((files) => files.every((f) => f.size <= 2 * 1024 * 1024), {
      message: "Each file must be 2MB or smaller",
    })
    .refine(
      (files) =>
        files.every((f) =>
          ALLOWED_MIME_TYPES.includes(
            f.type as (typeof ALLOWED_MIME_TYPES)[number]
          )
        ),
      {
        message: "Only images and PDF files are allowed",
      }
    ),
});

export const VerificationFormSchema = z
  .object({
    documents: z
      .array(VerificationDocSchema)
      .min(1, "Add at least one document"),
  })
  .refine((v) => v.documents.length > 0, {
    message: "Add at least one document",
    path: ["documents"],
  });

export type VerificationDoc = z.infer<typeof VerificationDocSchema>;
export type VerificationForm = z.infer<typeof VerificationFormSchema>;

interface VerificationState {
  isOpen: boolean;
  documents: VerificationDoc[];
  errors: Record<string, string | undefined>;
  open: () => void;
  close: () => void;
  addEmptyRow: () => void;
  removeRow: (index: number) => void;
  updateName: (index: number, name: string) => void;
  updateDescription: (index: number, description: string) => void;
  setFiles: (index: number, files: File[]) => void;
  validate: () => boolean;
  reset: () => void;
}

export const useVerificationStore = create<VerificationState>((set, get) => ({
  isOpen: false,
  documents: [
    {
      name: "",
      description: "",
      files: [],
    },
  ],
  errors: {},

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  addEmptyRow: () =>
    set((state) => ({
      documents: [
        ...state.documents,
        { name: "", document_type: "other", description: "", files: [] },
      ],
    })),

  removeRow: (index: number) =>
    set((state) => ({
      documents: state.documents.filter((_, i) => i !== index),
    })),

  updateName: (index: number, name: string) =>
    set((state) => {
      const next = [...state.documents];
      next[index] = { ...next[index], name };
      return { documents: next };
    }),

  updateDescription: (index: number, description: string) =>
    set((state) => {
      const next = [...state.documents];
      next[index] = { ...next[index], description };
      return { documents: next };
    }),

  setFiles: (index: number, files: File[]) =>
    set((state) => {
      const next = [...state.documents];
      next[index] = { ...next[index], files };
      return { documents: next };
    }),

  validate: () => {
    const state = get();
    const parsed = VerificationFormSchema.safeParse({
      documents: state.documents,
    });
    if (parsed.success) {
      set({ errors: {} });
      return true;
    }
    const errs: Record<string, string> = {};
    parsed.error.issues.forEach((i) => {
      const key = i.path.join(".") || "form";
      errs[key] = i.message;
    });
    set({ errors: errs });
    return false;
  },

  reset: () =>
    set({ documents: [{ name: "", description: "", files: [] }], errors: {} }),
}));
