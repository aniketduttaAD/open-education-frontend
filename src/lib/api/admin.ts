import Axios from "axios";

// Create a separate axios instance for admin API calls without automatic token injection
const adminApiClient = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Import the regular api for the owner token endpoint (which doesn't need special auth)
import api from "@/lib/axios";

interface OwnerTokenResponse {
  success: boolean;
  data: {
    token: string;
    owner: {
      id: string;
      email: string;
      name: string;
      isOwner: boolean;
      permissions: string[];
    };
    expires_in: string;
    permissions: string[];
  };
  message: string;
  timestamp: string;
}

interface OwnerInfoResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    name: string;
    isOwner: boolean;
    permissions: string[];
  };
  message: string;
  timestamp: string;
}

interface PendingTutor {
  id: string;
  name: string;
  email: string;
  bio: string;
  expertise: string[];
  verification_status: "pending";
  created_at: string;
  documents: unknown[];
}

interface VerificationStats {
  total_pending: number;
  total_verified: number;
  total_rejected: number;
  pending_this_week: number;
  verified_this_week: number;
}

interface ApiTestResult {
  endpoint: string;
  status: "success" | "error";
  response?: unknown;
  error?: string;
}

export const adminApi = {
  // Get owner admin token
  getOwnerToken: async (): Promise<OwnerTokenResponse["data"]> => {
    const { data } = await api.get<OwnerTokenResponse>("/auth/owner/token");
    if (!data.success) {
      throw new Error(data.message || "Failed to get owner token");
    }
    return data.data;
  },

  // Get owner admin info
  getOwnerInfo: async (token: string): Promise<OwnerInfoResponse["data"]> => {
    const { data } = await adminApiClient.get<OwnerInfoResponse>(
      "/auth/owner/info",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!data.success) {
      throw new Error(data.message || "Failed to get owner info");
    }
    return data.data;
  },

  // Get pending tutor verifications
  getPendingTutors: async (token: string): Promise<PendingTutor[]> => {
    console.log("Admin API - Using token:", token);
    const { data } = await adminApiClient.get<{
      success: boolean;
      data: {
        success: boolean;
        data: {
          tutors: PendingTutor[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        };
        message: string;
        timestamp: string;
      };
      message: string;
      timestamp: string;
    }>("/admin/tutors/pending-verification", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!data.success) {
      throw new Error(data.message || "Failed to get pending tutors");
    }
    // Handle nested response structure
    const actualData = data.data;
    if (!actualData.success) {
      throw new Error(actualData.message || "Failed to get pending tutors");
    }
    console.log("Tutors received:", actualData.data.tutors);
    return actualData.data.tutors;
  },

  // Approve tutor
  approveTutor: async (token: string, tutorId: string): Promise<void> => {
    console.log("Admin API - Approving tutor:", tutorId, "with token:", token);
    const { data } = await adminApiClient.post<{
      success: boolean;
      message: string;
    }>(
      `/admin/tutors/${tutorId}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Approve tutor response:", data);
    if (!data.success) {
      throw new Error(data.message || "Failed to approve tutor");
    }
  },

  // Reject tutor
  rejectTutor: async (
    token: string,
    tutorId: string,
    reason: string
  ): Promise<void> => {
    console.log(
      "Admin API - Rejecting tutor:",
      tutorId,
      "with reason:",
      reason,
      "and token:",
      token
    );
    const { data } = await adminApiClient.post<{
      success: boolean;
      message: string;
    }>(
      `/admin/tutors/${tutorId}/reject`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Reject tutor response:", data);
    if (!data.success) {
      throw new Error(data.message || "Failed to reject tutor");
    }
  },

  // Get verification statistics
  getVerificationStats: async (token: string): Promise<VerificationStats> => {
    console.log("Admin API - Getting verification stats with token:", token);
    const { data } = await adminApiClient.get<{
      success: boolean;
      data: {
        success: boolean;
        data: {
          total: number;
          pending: number;
          verified: number;
          rejected: number;
          verification_rate: string;
        };
        message: string;
        timestamp: string;
      };
      message: string;
      timestamp: string;
    }>("/admin/tutors/verification-stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!data.success) {
      throw new Error(data.message || "Failed to get verification stats");
    }
    // Handle nested response structure
    const actualData = data.data;
    if (!actualData.success) {
      throw new Error(actualData.message || "Failed to get verification stats");
    }
    console.log("Verification stats received:", actualData.data);

    // Return the actual data structure from the API
    return actualData.data as Record<string, unknown>;
  },

  // Test all endpoints with owner token
  testAllEndpoints: async (token: string): Promise<ApiTestResult[]> => {
    const results: ApiTestResult[] = [];
    const endpoints = [
      { name: "User Profile", url: "/users/profile", method: "GET" },
      { name: "Courses", url: "/courses", method: "GET" },
      { name: "AI Topics", url: "/ai/topics", method: "GET" },
      {
        name: "Pending Tutors",
        url: "/admin/tutors/pending-verification",
        method: "GET",
      },
      {
        name: "Verification Stats",
        url: "/admin/tutors/verification-stats",
        method: "GET",
      },
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await adminApiClient({
          method: endpoint.method.toLowerCase() as
            | "get"
            | "post"
            | "put"
            | "delete",
          url: endpoint.url,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        results.push({
          endpoint: endpoint.name,
          status: "success",
          response: response.data,
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        results.push({
          endpoint: endpoint.name,
          status: "error",
          error: errorMessage,
        });
      }
    }

    return results;
  },

  // Test specific endpoint
  testEndpoint: async (
    token: string,
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data?: unknown
  ): Promise<unknown> => {
    const response = await adminApiClient({
      method: method.toLowerCase() as "get" | "post" | "put" | "delete",
      url: endpoint,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
