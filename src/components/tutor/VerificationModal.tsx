"use client";

import { useMemo, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { X, Plus, Minus, UploadCloud } from "lucide-react";
import { useVerificationStore } from "@/store/verificationStore";
import { cn } from "@/lib/utils";
import { usersApi } from "@/lib/api/users";
import type { TutorDocumentType } from "@/lib/userTypes";

interface VerificationModalProps {
  onSubmit?: (data: { name: string; files: File[] }[]) => Promise<void> | void;
}

export function VerificationModal({ onSubmit }: VerificationModalProps) {
  const {
    isOpen,
    close,
    documents,
    errors,
    addEmptyRow,
    removeRow,
    updateName,
    setFiles,
    validate,
    reset,
    updateDescription,
  } = useVerificationStore();

  const [submitting, setSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const hasMultiple = documents.length > 1;
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleFiles = (index: number, fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);
    setFiles(index, files);
  };

  const onDrop = (index: number, ev: React.DragEvent<HTMLLabelElement>) => {
    ev.preventDefault();
    const files = ev.dataTransfer?.files;
    if (files && files.length) {
      handleFiles(index, files);
    }
  };

  const enforceConstraints = (files: File[]): string | null => {
    for (const f of files) {
      if (f.size > 2 * 1024 * 1024) {
        return `File ${f.name} exceeds 2MB limit`;
      }
    }
    return null;
  };

  const submit = useMemo(
    () => async () => {
      if (!validate()) return;

      const flatFiles = documents.flatMap((d) => d.files);
      const sizeErr = enforceConstraints(flatFiles);
      if (sizeErr) {
        setGeneralError(sizeErr);
        return;
      }

      // Enforce maximum of 5 files in a single upload batch
      if (flatFiles.length > 5) {
        setGeneralError(
          "You can upload a maximum of 5 verification documents per submission."
        );
        return;
      }

      try {
        setSubmitting(true);
        for (const doc of documents) {
          const docType: TutorDocumentType = "other";
          for (const f of doc.files) {
            await usersApi.uploadTutorDocument(
              f,
              docType,
              doc.description || doc.name
            );
          }
        }

        await onSubmit?.(documents);
        reset();
        close();
      } finally {
        setSubmitting(false);
      }
    },
    [documents, validate, onSubmit, reset, close]
  );

  const footerActions = useMemo(
    () => (
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-neutral-500">
          Drag & drop files or use the picker. Max 5 files per item.
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => close()}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        </div>
      </div>
    ),
    [close, submit, submitting]
  );

  return (
    <Modal isOpen={isOpen} onClose={close} size="lg" className="p-0">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
        <h3 className="text-lg font-semibold">
          Verify your account with documents
        </h3>
        <button onClick={close} className="p-2 rounded-md hover:bg-neutral-100">
          <X className="w-5 h-5 text-neutral-600" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-4"
      >
        {generalError && (
          <div className="text-sm text-red-600">{generalError}</div>
        )}

        {documents.map((doc, idx) => (
          <div key={idx} className="border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={doc.name}
                onChange={(e) => updateName(idx, e.target.value)}
                placeholder="Document name (e.g., Government ID, Certificate)"
                className={cn(
                  "flex-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-neutral-200",
                  errors[`documents.${idx}.name`] && "border-red-400"
                )}
              />

              {hasMultiple && (
                <button
                  onClick={() => removeRow(idx)}
                  className="p-2 rounded-md border border-neutral-200 hover:bg-neutral-50"
                  aria-label="Remove document row"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>

            {errors[`documents.${idx}.name`] && (
              <p className="text-sm text-red-600 mt-1">
                {errors[`documents.${idx}.name`]}
              </p>
            )}

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={doc.description || ""}
                onChange={(e) => updateDescription(idx, e.target.value)}
                placeholder="Short description (optional)"
                className="px-3 py-2 border rounded-md"
              />
            </div>

            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(idx, e)}
              className={cn(
                "mt-3 flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-neutral-200 p-6 text-center cursor-pointer hover:bg-neutral-50",
                errors[`documents.${idx}.files`] && "border-red-400"
              )}
            >
              <UploadCloud className="w-5 h-5 text-neutral-500" />
              <div className="text-sm text-neutral-700">
                Drop files here, or click to browse
              </div>
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleFiles(idx, e.target.files)}
              />
            </label>
            {errors[`documents.${idx}.files`] && (
              <p className="text-sm text-red-600 mt-1">
                {errors[`documents.${idx}.files`]}
              </p>
            )}

            {!!doc.files.length && (
              <div className="mt-3 max-h-32 overflow-y-auto border border-neutral-200 rounded-md">
                {doc.files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 border-b last:border-b-0"
                  >
                    <span className="text-sm text-neutral-800 truncate mr-3">
                      {f.name}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {(f.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end">
          <button
            onClick={addEmptyRow}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-200 hover:bg-neutral-50"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add another document</span>
          </button>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-neutral-200">
        {footerActions}
      </div>
    </Modal>
  );
}

export default VerificationModal;
