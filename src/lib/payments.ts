import api from "./axios";

export type OrderType = "tutor_registration" | "course_enrollment";

export interface CreateOrderBody {
  orderType: OrderType;
  amount: number;
  courseId?: string;
  tutorId?: string;
}

export interface CreateOrderResponse {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentBody {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PaymentOrderDTO {
  orderId: string;
  status: string;
  amount: number;
  createdAt: string;
  hasPayments?: boolean;
}

async function createOrder(body: CreateOrderBody) {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("You must be logged in to start a payment.");
    }
  }
  const { data } = await api.post<
    | { data: CreateOrderResponse }
    | {
        success: boolean;
        data: { success: boolean; message?: string; data: CreateOrderResponse };
      }
  >("/payments/create-order", body);
  // Unwrap common API envelope variants
  // Case 1: { data: { ...CreateOrderResponse } }
  // Case 2: { success, data: { success, message, data: { ...CreateOrderResponse } } }
  const inner =
    (data as { data?: { data?: CreateOrderResponse } })?.data?.data ??
    (data as { data?: CreateOrderResponse })?.data;
  if (!inner?.keyId || !inner?.razorpayOrderId) {
    throw new Error("Invalid order response from server.");
  }
  return inner as CreateOrderResponse;
}

async function verifyPayment(body: VerifyPaymentBody) {
  const { data } = await api.post<{ data: unknown }>(
    "/payments/verify-payment",
    body
  );
  return data.data;
}

async function getUserOrders(
  range: "week" | "month" | "year" | "all",
  sort: "asc" | "desc"
) {
  const { data } = await api.get<{ data: PaymentOrderDTO[] }>(
    `/payments/user-orders`,
    { params: { range, sort } }
  );
  return data.data;
}

async function getTutorPayments(
  range: "week" | "month" | "year" | "all",
  sort: "asc" | "desc"
) {
  const { data } = await api.get<{ data: PaymentOrderDTO[] }>(
    `/payments/tutor-payments`,
    { params: { range, sort } }
  );
  return data.data;
}

async function getTutorEarnings(monthYear?: string) {
  const { data } = await api.get<{ data: { total: number; count: number } }>(
    `/payments/tutor-earnings`,
    { params: monthYear ? { monthYear } : {} }
  );
  return data.data;
}

export const paymentsApi = {
  createOrder,
  verifyPayment,
  getUserOrders,
  getTutorPayments,
  getTutorEarnings,
};

export async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if ((window as { Razorpay?: unknown }).Razorpay) return true;
  if (document.getElementById("razorpay-sdk")) return true;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function usePayment() {
  const processPayment = async () => {
    throw new Error("Payment processing not available");
  };

  return {
    processPayment,
  };
}
