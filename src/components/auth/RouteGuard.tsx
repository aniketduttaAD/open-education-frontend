"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

const PUBLIC_PATHS = new Set<string>([
  "/",
  "/login",
  "/auth/callback",
  "/courses",
  "/student", // allow student landing to be accessed without auth
]);

export function RouteGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, userLoading, fetchUser } = useUserStore();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const path = pathname || "/";
    
    if (PUBLIC_PATHS.has(path)) return;
    
    if (path.startsWith("/courses/") && !path.includes("/generate")) return;

    if (userLoading) return;

    // Mark that we've checked at least once
    if (!hasChecked) {
      setHasChecked(true);
      return; // Don't redirect on the very first check
    }

    const hasToken = typeof window !== "undefined" && localStorage.getItem("access_token");
    
    if (!user && !hasToken) {
      router.replace("/");
    }
  }, [pathname, user, userLoading, router, hasChecked]);

  return null;
}

export default RouteGuard;


