"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import { RoleSelectionModal } from "@/components/auth/RoleSelectionModal";

// Centralized onboarding logic handler. Lives at the root layout so it runs everywhere.
export function OnboardingHandler() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, userLoading, fetchUser } = useUserStore();
  const showRole = useAuthStore((s) => s.showRoleModal);
  const openRoleModal = useAuthStore((s) => s.openRoleModal);

  // Hydrate user on first mount and on hard reloads
  useEffect(() => {
    // Always fetch fresh user to rehydrate; avoids relying on local storage
    fetchUser();
  }, [fetchUser]);

  const isSkipPath = useMemo(() => {
    const skip = new Set([
      "/auth/callback",
      "/tutor/onboarding",
      "/tutor/onboarding/payment",
      "/tutor/onboarding/details",
      "/tutor/onboarding/documents",
      "/student/onboarding",
      "/login",
    ]);
    return pathname ? skip.has(pathname) : false;
  }, [pathname]);

  // Global redirect + role detection and onboarding routing
  useEffect(() => {
    if (userLoading) return;
    if (!user) return; // not authenticated or still loading
    if (isSkipPath) return; // do not interfere with onboarding/auth pages

    // 1) No role selected -> role selection modal inline
    if (!user.user_type) {
      openRoleModal();
      return;
    }

    // 2) Student flow
    if (user.user_type === "student") {
      if (!user.onboarding_complete) {
        router.push("/student/onboarding");
        return;
      }
    }

    // 3) Tutor flow and edge cases
    if (user.user_type === "tutor") {
      const td = user.tutor_details || null;
      const bank = td?.bank_details || null;
      const bankIncomplete =
        !bank ||
        !bank.account_holder_name ||
        !bank.account_number ||
        !bank.ifsc_code ||
        !bank.bank_name ||
        !bank.account_type;

      // Route to correct step pages
      if (!user.onboarding_complete) {
        if (!td?.register_fees_paid) {
          router.push("/tutor/onboarding/payment");
          return;
        }
        // If bank is incomplete, force tutor details page to collect bank
        if (bankIncomplete) {
          router.push("/tutor/onboarding/details");
          return;
        }
        // Optionally, if other details are complete and docs needed, could route docs here
        return;
      }
      // Even if onboarding_complete is true, ensure bank details are present; otherwise send to details
      if (bankIncomplete) {
        router.push("/tutor/onboarding/details");
        return;
      }
      if (user.document_verification == null) {
        router.push("/tutor/onboarding/documents");
        return;
      }
      if (user.document_verification === "pending") {
        // Do not route to upload if pending
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoading, isSkipPath, router]);

  return (
    <>
      {/* Role selection modal: triggered when user exists and user_type is null. */}
      <RoleSelectionModal
        isOpen={!!showRole && !!user && !userLoading && !user.user_type}
      />
    </>
  );
}

export default OnboardingHandler;
