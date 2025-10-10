"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { useUserStore } from "@/store/userStore";
import { paymentsApi, loadRazorpayScript } from "@/lib/payments";

export default function TutorPaymentPage() {
  const router = useRouter();
  const { user, fetchUser } = useUserStore();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Tutor Payment - OpenEducation";
  }, []);

  useEffect(() => {
    // If already paid, go to details
    if (user?.tutor_details?.register_fees_paid) {
      router.replace("/tutor/onboarding/details");
    }
  }, [user, router]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const ok = await loadRazorpayScript();
      if (!ok) {
        showToast("Failed to load payment gateway. Please retry.", "error");
        setLoading(false);
        return;
      }

      const order = await paymentsApi.createOrder({ orderType: "tutor_registration", amount: 1000 });
      const options = {
        key: order.keyId,
        order_id: order.razorpayOrderId,
        amount: order.amount * 100,
        currency: order.currency,
        name: "OpenEdu",
        description: "Tutor Registration Fee",
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; }) => {
          try {
            await paymentsApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            await fetchUser();
            router.replace("/tutor/onboarding/details");
          } catch {
            showToast("Verification failed. Please contact support or retry.", "error");
          }
        },
        modal: { ondismiss: () => showToast("Payment cancelled.", "warning") },
      } as unknown as { [k: string]: unknown };

      if (!(window as { Razorpay?: any }).Razorpay) {
        showToast("Payment gateway unavailable. Please refresh and try again.", "error");
      } else {
        const rz = new (window as any).Razorpay(options);
        rz.open();
      }
    } catch (e) {
      showToast("Payment failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-neutral-900">Onboarding Fee</h1>
            <p className="text-neutral-600">A one-time fee of ₹1000 is required to verify your account.</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8 text-secondary-600" />
            </div>
            <div className="bg-neutral-50 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-3xl font-bold text-neutral-900 mb-2">₹1,000</div>
              <div className="text-sm text-neutral-600">One-time onboarding fee</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Button size="lg" onClick={handlePayment} disabled={loading}>
                {loading ? "Processing..." : "Make Payment"}
              </Button>
              <p className="text-xs text-neutral-500">You will be redirected to Razorpay. We only proceed after successful verification.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


