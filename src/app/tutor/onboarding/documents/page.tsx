"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Shield } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useVerificationStore } from "@/store/verificationStore";
import { usersApi } from "@/lib/api/users";
import { Plus, UploadCloud, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TutorDocumentsPage() {
  const router = useRouter();
  const {
    user,
    fetchUser,
    tutorDocuments,
    fetchTutorDocuments,
    documentsLoading,
  } = useUserStore();
  const {
    documents,
    errors,
    addEmptyRow,
    updateName,
    updateDescription,
    setFiles,
    validate,
    removeRow,
  } = useVerificationStore();

  useEffect(() => {
    document.title = "Tutor Documents - OpenEducation";
  }, []);

  useEffect(() => {
    // Redirect rules
    if (!user) return;
    if (user.user_type !== "tutor") {
      router.replace("/");
      return;
    }
    if (!user.onboarding_complete) {
      // If fees not paid -> payment; else details
      if (!user.tutor_details?.register_fees_paid)
        router.replace("/tutor/onboarding/payment");
      else router.replace("/tutor/onboarding/details");
      return;
    }
    // If bank details are incomplete, send to details
    const bank = user.tutor_details?.bank_details;
    const bankIncomplete =
      !bank ||
      !bank.account_holder_name ||
      !bank.account_number ||
      !bank.ifsc_code ||
      !bank.bank_name ||
      !bank.account_type;
    if (bankIncomplete) {
      router.replace("/tutor/onboarding/details");
      return;
    }
    if (user.document_verification === "pending") {
      // Do not force to upload if pending
      return;
    }
  }, [user, router]);

  useEffect(() => {
    if (tutorDocuments.length === 0 && !documentsLoading) fetchTutorDocuments();
  }, [tutorDocuments.length, documentsLoading, fetchTutorDocuments]);

  const handleFiles = (index: number, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const first = fileList.item(0);
    if (!first) return;
    // Only allow images and PDFs
    const isAllowed = first.type.startsWith("image/") || first.type === "application/pdf";
    if (!isAllowed) return;
    setFiles(index, [first]);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const num = bytes / Math.pow(k, i);
    return `${num.toFixed(num >= 100 ? 0 : num >= 10 ? 1 : 2)} ${sizes[i]}`;
  };

  const onSubmit = async () => {
    const v = validate();
    if (Object.keys(v).length) return;
    for (const doc of documents) {
      for (const file of doc.files) {
        await usersApi.uploadTutorDocument(
          file,
          "other",
          doc.description || doc.name
        );
      }
    }
    await fetchUser();
    router.replace("/tutor/dashboard");
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-neutral-900">
              Document Verification
            </h1>
            <p className="text-neutral-600">
              Upload your documents to complete verification.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="border border-neutral-200 rounded-lg p-4"
              >
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
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    disabled={documents.length === 1}
                    className="inline-flex items-center gap-1 px-2 py-2 rounded border border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={documents.length === 1 ? "At least one document required" : "Remove document"}
                    title={documents.length === 1 ? "At least one document required" : "Remove document"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
                {(!doc.files || doc.files.length === 0) && (
                  <label
                    className={cn(
                      "mt-3 flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-neutral-200 p-6 text-center cursor-pointer hover:bg-neutral-50",
                      errors[`documents.${idx}.files`] && "border-red-400"
                    )}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const dt = e.dataTransfer;
                      if (!dt) return;
                      handleFiles(idx, dt.files);
                    }}
                  >
                    <UploadCloud className="w-5 h-5 text-neutral-500" />
                    <div className="text-sm text-neutral-700">
                      Drop a file here, or click to browse
                    </div>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFiles(idx, e.target.files)}
                    />
                  </label>
                )}
                {errors[`documents.${idx}.files`] && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors[`documents.${idx}.files`]}
                  </p>
                )}
                {doc.files && doc.files.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-neutral-700 mb-2">
                      Selected file
                    </div>
                    <ul className="space-y-2">
                      {doc.files.slice(0, 1).map((file, fIdx) => (
                        <li key={fIdx} className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 px-3 py-2 text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-neutral-100 text-neutral-600 text-xs flex-shrink-0">
                              {file.type.includes("pdf") ? "PDF" : "IMG"}
                            </span>
                            <span className="truncate" title={file.name}>{file.name}</span>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-neutral-500">{formatBytes(file.size)}</span>
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-700 underline"
                              onClick={() => setFiles(idx, [])}
                            >
                              Clear
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
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
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <Button onClick={onSubmit} size="lg">
                Upload Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
