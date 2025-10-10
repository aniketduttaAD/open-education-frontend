"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Toast } from "@/components/ui/Toast";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { adminApi } from "@/lib/api/admin";
import type { OwnerToken, PendingTutor, VerificationStats } from "@/lib/types";

// TutorAccordion Component
interface TutorAccordionProps {
  tutor: PendingTutor;
  index: number;
  onApprove: () => void;
  onReject: () => void;
  loading: boolean;
}

function TutorAccordion({
  tutor,
  index,
  onApprove,
  onReject,
  loading,
}: TutorAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      {/* Accordion Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          {tutor.image && (
            <img
              src={tutor.image}
              alt={tutor.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="font-semibold text-lg">{tutor.name}</h3>
            <p className="text-gray-600 text-sm">{tutor.email}</p>
            <p className="text-xs text-gray-500">
              Applied: {new Date(tutor.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              tutor.tutor_details?.verification_status === "verified"
                ? "bg-green-100 text-green-800"
                : tutor.tutor_details?.verification_status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {tutor.tutor_details?.verification_status || "Unknown"}
          </span>

          {/* Action Buttons */}
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={onApprove}
              variant="primary"
              size="sm"
              loading={loading}
              disabled={loading}
            >
              Approve
            </Button>
            <Button
              onClick={onReject}
              variant="danger"
              size="sm"
              loading={loading}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white border border-red-600"
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                border: "1px solid #dc2626",
                minWidth: "80px",
                display: "inline-flex",
                visibility: "visible",
              }}
            >
              Reject
            </Button>
          </div>

          {/* Toggle Icon */}
          <div className="ml-2">
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium text-lg mb-3 text-gray-800">
                Personal Information
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Bio:</strong>{" "}
                  {tutor.tutor_details?.bio || "Not provided"}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {tutor.tutor_details?.dob || "Not provided"}
                </p>
                <p>
                  <strong>Gender:</strong>{" "}
                  {tutor.tutor_details?.gender || "Not provided"}
                </p>
                <p>
                  <strong>Teaching Experience:</strong>{" "}
                  {tutor.tutor_details?.teaching_experience || "Not provided"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-3 text-gray-800">
                Education & Qualifications
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Degree:</strong>{" "}
                  {tutor.tutor_details?.qualifications?.degree ||
                    "Not provided"}
                </p>
                <p>
                  <strong>Year:</strong>{" "}
                  {tutor.tutor_details?.qualifications?.year || "Not provided"}
                </p>
                <p>
                  <strong>Institution:</strong>{" "}
                  {tutor.tutor_details?.qualifications?.institution ||
                    "Not provided"}
                </p>
                <p>
                  <strong>Additional:</strong>{" "}
                  {tutor.tutor_details?.qualifications?.additional ||
                    "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Expertise Areas */}
          <div className="mb-6">
            <h4 className="font-medium text-lg mb-3 text-gray-800">
              Expertise & Specializations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Expertise Areas:</p>
                <div className="flex flex-wrap gap-1">
                  {tutor.tutor_details?.expertise_areas?.map((area, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {area}
                    </span>
                  )) || (
                    <span className="text-gray-500 text-sm">Not specified</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Specializations:</p>
                <div className="flex flex-wrap gap-1">
                  {tutor.tutor_details?.specializations?.map((spec, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                    >
                      {spec}
                    </span>
                  )) || (
                    <span className="text-gray-500 text-sm">Not specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="mb-6">
            <h4 className="font-medium text-lg mb-3 text-gray-800">
              Languages Spoken
            </h4>
            <div className="flex flex-wrap gap-1">
              {tutor.tutor_details?.languages_spoken?.map((language, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
                >
                  {language}
                </span>
              )) || (
                <span className="text-gray-500 text-sm">Not specified</span>
              )}
            </div>
          </div>

          {/* Bank Details */}
          <div className="mb-6">
            <h4 className="font-medium text-lg mb-3 text-gray-800">
              Bank Details
            </h4>
            <div className="bg-white p-4 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Bank Name:</strong>{" "}
                    {tutor.tutor_details?.bank_details?.bank_name ||
                      "Not provided"}
                  </p>
                  <p>
                    <strong>Account Holder:</strong>{" "}
                    {tutor.tutor_details?.bank_details?.account_holder_name ||
                      "Not provided"}
                  </p>
                  <p>
                    <strong>Account Type:</strong>{" "}
                    {tutor.tutor_details?.bank_details?.account_type ||
                      "Not provided"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>IFSC Code:</strong>{" "}
                    {tutor.tutor_details?.bank_details?.ifsc_code ||
                      "Not provided"}
                  </p>
                  <p>
                    <strong>Account Number:</strong>{" "}
                    {tutor.tutor_details?.bank_details?.account_number ||
                      "Not provided"}
                  </p>
                  <p>
                    <strong>Verified:</strong>
                    <span
                      className={`ml-1 ${
                        tutor.tutor_details?.bank_details?.verified
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {tutor.tutor_details?.bank_details?.verified
                        ? "Yes"
                        : "No"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Status */}
          <div className="mb-6">
            <h4 className="font-medium text-lg mb-3 text-gray-800">
              Document Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2 text-green-600">
                  Required Documents:
                </p>
                <div className="space-y-1">
                  <p className="text-sm">• Degree Certificate</p>
                  <p className="text-sm">• ID Proof</p>
                  <p className="text-sm">• Address Proof</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2 text-red-600">
                  Missing Documents:
                </p>
                <div className="flex flex-wrap gap-1">
                  {tutor.missing_documents?.map((doc, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded"
                    >
                      {doc}
                    </span>
                  )) || (
                    <span className="text-gray-500 text-sm">
                      All documents provided
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm">
                <strong>Registration Fee Paid:</strong>
                <span
                  className={`ml-1 ${
                    tutor.tutor_details?.register_fees_paid
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {tutor.tutor_details?.register_fees_paid ? "Yes" : "No"}
                </span>
              </p>
              <p className="text-sm">
                <strong>Document Count:</strong> {tutor.document_count || 0}
              </p>
            </div>
          </div>

          {/* Verification Status Summary */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Verification Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tutor.tutor_details?.verification_status === "verified"
                      ? "bg-green-100 text-green-800"
                      : tutor.tutor_details?.verification_status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {tutor.tutor_details?.verification_status || "Unknown"}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Has Required Documents:{" "}
                {tutor.has_required_documents ? "Yes" : "No"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [ownerToken, setOwnerToken] = useState<OwnerToken | null>(null);
  const [pendingTutors, setPendingTutors] = useState<PendingTutor[]>([]);
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auto-generate token on page load for testing
  useEffect(() => {
    getOwnerToken();
  }, []);

  const getOwnerToken = async () => {
    setLoading(true);
    try {
      const tokenData = await adminApi.getOwnerToken();
      console.log("Token data received:", tokenData);

      // The API returns nested structure, extract the actual token data
      const actualTokenData =
        (tokenData as Record<string, unknown>).data || tokenData;
      console.log("Actual token data:", actualTokenData);

      setOwnerToken(actualTokenData as OwnerToken);
      showToast("Owner token generated successfully", "success");
    } catch (error) {
      console.error("Failed to get owner token:", error);
      showToast("Failed to get owner token", "error");
    } finally {
      setLoading(false);
    }
  };

  const getOwnerInfo = async () => {
    if (!ownerToken || !ownerToken.token) {
      showToast("Token not available yet, please wait...", "warning");
      return;
    }

    setLoading(true);
    try {
      const ownerInfo = await adminApi.getOwnerInfo(ownerToken.token);
      showToast("Owner info retrieved successfully", "success");
      console.log("Owner Info:", ownerInfo);
    } catch (error) {
      console.error("Failed to get owner info:", error);
      showToast("Failed to get owner info", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadPendingTutors = async () => {
    if (!ownerToken || !ownerToken.token) {
      showToast("Token not available yet, please wait...", "warning");
      return;
    }

    setLoading(true);
    try {
      const tutors = await adminApi.getPendingTutors(ownerToken.token);
      setPendingTutors(tutors);
      showToast("Pending tutors loaded successfully", "success");
    } catch (error) {
      console.error("Failed to load pending tutors:", error);
      showToast("Failed to load pending tutors", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadVerificationStats = async () => {
    if (!ownerToken) {
      showToast("Token not available yet, please wait...", "warning");
      return;
    }

    setLoading(true);
    try {
      const verificationStats = await adminApi.getVerificationStats(
        ownerToken.token
      );
      setStats(verificationStats);
      showToast("Verification stats loaded successfully", "success");
    } catch (error) {
      console.error("Failed to load verification stats:", error);
      showToast("Failed to load verification stats", "error");
    } finally {
      setLoading(false);
    }
  };

  const approveTutor = async (tutorId: string) => {
    if (!ownerToken) {
      showToast("Token not available yet, please wait...", "warning");
      return;
    }

    setLoading(true);
    try {
      await adminApi.approveTutor(ownerToken.token, tutorId);
      showToast("Tutor approved successfully", "success");
      loadPendingTutors(); // Refresh the list
      loadVerificationStats(); // Refresh stats
    } catch (error) {
      console.error("Failed to approve tutor:", error);
      showToast("Failed to approve tutor", "error");
    } finally {
      setLoading(false);
    }
  };

  const rejectTutor = async (tutorId: string, reason: string) => {
    if (!ownerToken) {
      showToast("Token not available yet, please wait...", "warning");
      return;
    }

    setLoading(true);
    try {
      await adminApi.rejectTutor(ownerToken.token, tutorId, reason);
      showToast("Tutor rejected successfully", "success");
      loadPendingTutors(); // Refresh the list
      loadVerificationStats(); // Refresh stats
    } catch (error) {
      console.error("Failed to reject tutor:", error);
      showToast("Failed to reject tutor", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                OpenEdu Admin Panel
              </h1>
              <p className="text-gray-600">
                Owner Admin System - Full Access Control
              </p>
              <div className="mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Testing Mode:</strong> Token auto-generated on page
                  load for testing purposes
                </p>
              </div>
            </div>

            {/* Owner Token Section */}
            <Card className="mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Owner Admin Token
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button
                      onClick={getOwnerToken}
                      loading={loading}
                      disabled={loading}
                    >
                      {ownerToken ? "Regenerate Token" : "Get Owner Token"}
                    </Button>
                    <Button
                      onClick={getOwnerInfo}
                      loading={loading}
                      disabled={loading || !ownerToken}
                    >
                      Get Owner Info
                    </Button>
                  </div>

                  {!ownerToken && loading && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm">
                        Auto-generating token for testing...
                      </span>
                    </div>
                  )}

                  {ownerToken && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <h3 className="font-medium text-green-800">
                          Token Ready for Testing
                        </h3>
                      </div>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Token Available:</strong>{" "}
                          {ownerToken.token ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>ID:</strong> {ownerToken.owner?.id || "N/A"}
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          {ownerToken.owner?.email || "N/A"}
                        </p>
                        <p>
                          <strong>Name:</strong>{" "}
                          {ownerToken.owner?.name || "N/A"}
                        </p>
                        <p>
                          <strong>Is Owner:</strong>{" "}
                          {ownerToken.owner?.isOwner ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>Permissions:</strong>{" "}
                          {ownerToken.owner?.permissions?.join(", ") || "N/A"}
                        </p>
                        <p>
                          <strong>Expires:</strong>{" "}
                          {ownerToken.expires_in || "N/A"}
                        </p>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-600 break-all">
                          <strong>Token:</strong>{" "}
                          {ownerToken.token?.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Verification Stats */}
            <Card className="mb-6">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Verification Statistics
                  </h2>
                  <Button
                    onClick={loadVerificationStats}
                    loading={loading}
                    disabled={loading || !ownerToken}
                  >
                    Load Stats
                  </Button>
                </div>

                {stats ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-900">
                        Total Pending
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {String(
                          (stats as unknown as Record<string, unknown>)
                            .pending || 0
                        )}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-medium text-green-900">
                        Total Verified
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {String(
                          (stats as unknown as Record<string, unknown>)
                            .verified || 0
                        )}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-medium text-red-900">
                        Total Rejected
                      </h3>
                      <p className="text-2xl font-bold text-red-600">
                        {String(
                          (stats as unknown as Record<string, unknown>)
                            .rejected || 0
                        )}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-medium text-purple-900">
                        Verification Rate
                      </h3>
                      <p className="text-2xl font-bold text-purple-600">
                        {String(
                          (stats as unknown as Record<string, unknown>)
                            .verification_rate || "0.00"
                        )}
                        %
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      No statistics loaded yet
                    </p>
                    <Button
                      onClick={loadVerificationStats}
                      loading={loading}
                      disabled={loading || !ownerToken}
                      variant="outline"
                    >
                      Load Verification Stats
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Pending Tutors */}
            <Card className="mb-6">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Pending Tutor Verifications
                  </h2>
                  <Button
                    onClick={loadPendingTutors}
                    loading={loading}
                    disabled={loading || !ownerToken}
                  >
                    Load Pending Tutors
                  </Button>
                </div>

                {pendingTutors.length > 0 ? (
                  <div className="space-y-2">
                    {pendingTutors.map((tutor, index) => (
                      <TutorAccordion
                        key={tutor.id}
                        tutor={tutor}
                        index={index}
                        onApprove={() => approveTutor(tutor.id)}
                        onReject={() => {
                          const reason = prompt("Enter rejection reason:");
                          if (reason) {
                            rejectTutor(tutor.id, reason);
                          }
                        }}
                        loading={loading}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No pending tutors found
                  </p>
                )}
              </div>
            </Card>

            {/* Loading Overlay */}
            {loading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <LoadingSpinner size="sm" />
                    <p className="text-gray-700 font-medium">Loading...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Toast */}
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}
          </div>
        </div>
      </ToastProvider>
    </AdminGuard>
  );
}
