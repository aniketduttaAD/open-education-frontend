"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuthStore } from "@/store/authStore";
// import { animations } from "@/lib/animations";

interface GoogleOneTapProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: unknown) => void;
          prompt: (callback?: (notification: unknown) => void) => void;
          renderButton: (element: HTMLElement, config: unknown) => void;
        };
      };
    };
  }
}

export function GoogleOneTap({
  isOpen,
  onClose,
  onSuccess,
}: GoogleOneTapProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { showToast } = useToast();
  const googleOneTapRef = useRef<HTMLDivElement>(null);
  const { googleOneTapLogin } = useAuthStore();

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      console.log("Google credential response:", response);

      if (!response.credential) {
        showToast("Failed to get Google credential", "error");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log(
          "Attempting Google One Tap login with token:",
          response.credential.substring(0, 20) + "..."
        );

        // Call the login API which handles the response structure and redirects
        await googleOneTapLogin(response.credential);

        console.log("Google One Tap login successful - redirecting...");

        // The auth store will handle the redirect automatically
        // No need to show toast or close modal as user will be redirected
        onSuccess?.();
        onClose();
      } catch (error) {
        console.error("Google One Tap login error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Authentication failed. Please try again.";
        showToast(errorMessage, "error");
      } finally {
        setIsLoading(false);
      }
    },
    [googleOneTapLogin, showToast, onSuccess, onClose]
  );

  // Load Google One Tap script
  useEffect(() => {
    if (!isOpen || isScriptLoaded) return;

    const initializeGoogleOneTap = () => {
      if (!window.google || !googleOneTapRef.current) {
        console.error("Google API not loaded or button ref not available");
        return;
      }

      try {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
          throw new Error("Google Client ID not configured");
        }

        console.log(
          "Initializing Google One Tap with client ID:",
          clientId.substring(0, 20) + "..."
        );

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(googleOneTapRef.current, {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          width: 300,
        });

        console.log("Google One Tap initialized successfully");
      } catch (error) {
        console.error("Error initializing Google One Tap:", error);
        showToast(
          "Failed to initialize Google authentication. Please check your configuration.",
          "error"
        );
        setIsLoading(false);
      }
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsScriptLoaded(true);
      initializeGoogleOneTap();
    };
    script.onerror = () => {
      showToast(
        "Failed to load Google authentication. Please try again.",
        "error"
      );
      setIsLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, [
    isOpen,
    isScriptLoaded,
    showToast,
    googleOneTapLogin,
    onSuccess,
    onClose,
    handleCredentialResponse,
  ]);

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-neutral-200/50"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.4,
            }}
          >
            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-50 p-8 pb-6">
              {/* Close Button */}
              <motion.button
                onClick={handleClose}
                disabled={isLoading}
                className="absolute top-6 right-6 p-2 hover:bg-white/80 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-neutral-600" />
              </motion.button>

              {/* Logo and Title */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mx-auto mb-6 relative">
                  <motion.div
                    className="w-20 h-20 flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src="/logo.png"
                      alt="OpenEducation"
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                  </motion.div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                </div>

                <motion.h2
                  className="text-3xl font-bold bg-gradient-to-r from-neutral-900 via-primary-800 to-secondary-800 bg-clip-text text-transparent mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Welcome to OpenEducation
                </motion.h2>

                <motion.p
                  className="text-neutral-600 text-lg leading-relaxed max-w-md mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Sign in with your Google account to start your learning
                  journey
                </motion.p>
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Google Sign-in Button */}
              <motion.div
                className="mb-8 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {isLoading ? (
                  <motion.div
                    className="w-full max-w-sm bg-gradient-to-r from-primary-500 to-secondary-500 border border-primary-300 rounded-xl px-8 py-6 flex items-center justify-center space-x-4 shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      animate={{
                        rotate: 360,
                        transition: {
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        },
                      }}
                    />
                    <span className="text-white font-semibold text-lg">
                      Signing in...
                    </span>
                  </motion.div>
                ) : (
                  <div className="relative w-full max-w-sm">
                    <div
                      ref={googleOneTapRef}
                      className="w-full flex justify-center"
                    />
                    {/* Custom Google button styling with gradient */}
                    <style jsx>{`
                      div[data-google-button] {
                        border-radius: 12px !important;
                        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15),
                          0 2px 4px rgba(168, 85, 247, 0.1) !important;
                        transition: all 0.3s ease !important;
                        border: 1px solid rgba(59, 130, 246, 0.3) !important;
                        width: 100% !important;
                        max-width: 320px !important;
                        margin: 0 auto !important;
                        background: linear-gradient(
                          135deg,
                          #3b82f6 0%,
                          #a855f7 100%
                        ) !important;
                        font-family: -apple-system, BlinkMacSystemFont,
                          "Segoe UI", Roboto, sans-serif !important;
                        color: white !important;
                      }
                      div[data-google-button]:hover {
                        transform: translateY(-2px) !important;
                        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25),
                          0 4px 8px rgba(168, 85, 247, 0.15) !important;
                        background: linear-gradient(
                          135deg,
                          #2563eb 0%,
                          #9333ea 100%
                        ) !important;
                      }
                      div[data-google-button]:focus {
                        outline: none !important;
                        border-color: #3b82f6 !important;
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
                      }
                      div[data-google-button]:active {
                        transform: translateY(0) !important;
                        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2) !important;
                      }
                    `}</style>
                  </div>
                )}
              </motion.div>

              {/* Terms and Privacy */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-sm text-neutral-500 leading-relaxed">
                  By continuing, you agree to our{" "}
                  <a
                    href="/terms"
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    Privacy Policy
                  </a>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
