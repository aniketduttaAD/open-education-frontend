"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/ToastProvider";
import { authApi } from "@/lib/api/auth";

// Extend Window interface for Google Identity Services
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

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Login - OpenEducation";
  }, []);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Handle the JWT token from Google
  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      try {
        setLoading(true);
        setError(null);

        console.log("Google JWT token received:", response.credential);

        // Send JWT token to backend for verification and user creation
        await authApi.googleOneTapLogin(response.credential);

        showToast("Login successful!", "success");
        router.push("/");
      } catch (err: unknown) {
        console.error("Google login error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Authentication failed";
        setError(errorMessage);
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast, router]
  );

  // Initialize Google Identity Services
  useEffect(() => {
    const initializeGoogle = () => {
      if (typeof window !== "undefined" && window.google) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

        if (!clientId) {
          setError("Google Client ID not configured");
          return;
        }

        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        // Render the Google button
        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            type: "standard",
            shape: "rectangular",
            text: "continue_with",
            logo_alignment: "left",
          });
        }
      } else {
        // Retry if Google SDK not loaded yet
        setTimeout(initializeGoogle, 100);
      }
    };

    initializeGoogle();
  }, [handleCredentialResponse]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Processing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-success-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-lg w-full mx-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-neutral-200/50">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 relative">
              <div className="w-20 h-20 flex items-center justify-center mx-auto">
                <Image
                  src="/logo.png"
                  alt="OpenEducation"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-lg"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
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
              </div>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-900 via-primary-800 to-secondary-800 bg-clip-text text-transparent mb-3">
              Welcome to OpenEducation
            </h1>
            <p className="text-neutral-600 text-lg leading-relaxed">
              Sign in with your Google account to start your learning journey
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-50/80 border border-error-200 rounded-2xl backdrop-blur-sm">
              <p className="text-error-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Google Identity Services Button */}
            <div className="relative w-full max-w-sm mx-auto">
              <div
                ref={googleButtonRef}
                className="w-full flex justify-center"
              ></div>
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
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                    Roboto, sans-serif !important;
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

            {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
              <div className="text-center p-4 bg-warning-50/80 border border-warning-200 rounded-2xl backdrop-blur-sm">
                <p className="text-warning-800 text-sm font-medium">
                  Google Client ID not configured. Please set
                  NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.
                </p>
              </div>
            )}

            {/* Features Preview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-primary-50/50 rounded-xl">
                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">
                    AI-Powered
                  </p>
                  <p className="text-xs text-neutral-600">Smart Learning</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-secondary-50/50 rounded-xl">
                <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">
                    Personalized
                  </p>
                  <p className="text-xs text-neutral-600">Your Pace</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500 leading-relaxed">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
