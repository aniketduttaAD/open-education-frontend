"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function TutorOnboardingIndexPage() {
  const router = useRouter();
  const { user, userLoading, fetchUser } = useUserStore();

  useEffect(() => {
    // Ensure we have fresh user data when landing directly on this route
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (userLoading) return;
    if (!user) return; // unauthenticated; let higher-level auth guard handle

    if (user.user_type !== "tutor") {
      // Non-tutor shouldn't be here; send students to their onboarding
      router.replace("/student/onboarding");
      return;
    }

    const tutorDetails = user.tutor_details || null;
    const bank = tutorDetails?.bank_details || null;
    const bankIncomplete =
      !bank ||
      !bank.account_holder_name ||
      !bank.account_number ||
      !bank.ifsc_code ||
      !bank.bank_name ||
      !bank.account_type;

    // Not completed: follow step order
    if (!user.onboarding_complete) {
      if (!tutorDetails?.register_fees_paid) {
        router.replace("/tutor/onboarding/payment");
        return;
      }
      if (bankIncomplete) {
        router.replace("/tutor/onboarding/details");
        return;
      }
      // If fees paid and bank complete, continue to documents by default
      router.replace("/tutor/onboarding/documents");
      return;
    }

    // Completed but missing bank -> details
    if (bankIncomplete) {
      router.replace("/tutor/onboarding/details");
      return;
    }

    // Completed and bank ok: if documents not verified yet, go to documents
    if (user.document_verification == null) {
      router.replace("/tutor/onboarding/documents");
      return;
    }

    // Pending verification -> stay out of upload flow; send to dashboard
    if (user.document_verification === "pending") {
      router.replace("/tutor/dashboard");
      return;
    }

    // All good -> tutor dashboard
    router.replace("/tutor/dashboard");
  }, [user, userLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Preparing your onboarding…</p>
      </div>
    </div>
  );
}


