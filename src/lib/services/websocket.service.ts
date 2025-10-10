import io from "socket.io-client";
import {
  WebSocketService,
  WebSocketServiceConfig,
  WebSocketEvent,
  WebSocketProgressEvent,
  WebSocketPhaseEvent,
  WebSocketFinalizeEvent,
} from "@/lib/types/courseGeneration";

export class WebSocketServiceImpl implements WebSocketService {
  private socket: ReturnType<typeof io> | null = null;
  private config: WebSocketServiceConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;
  private isManualDisconnect = false;

  constructor(config: WebSocketServiceConfig) {
    this.config = config;
    this.maxReconnectAttempts = config.reconnectAttempts || 5;
    this.reconnectDelay = config.reconnectDelay || 3000;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(this.config.url, {
        auth: {
          // Preferred: send token in handshake.auth
          token: `Bearer ${this.config.token}`,
        },
        transports: ["websocket"],
        timeout: 10000,
        forceNew: true,
      });

      this.socket.on("connect", () => {
        console.log("WebSocket connected successfully");
        this.reconnectAttempts = 0;
        this.isManualDisconnect = false;
        resolve();
      });

      this.socket.on("connect_error", (error: Error) => {
        console.error("WebSocket connection failed:", error);
        reject(error);
      });

      this.socket.on("disconnect", (reason: string) => {
        console.log("WebSocket disconnected:", reason);
        if (
          !this.isManualDisconnect &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.handleReconnect();
        }
      });

      this.socket.on("reconnect", (attemptNumber: number) => {
        console.log("WebSocket reconnected after", attemptNumber, "attempts");
        this.reconnectAttempts = 0;
      });

      this.socket.on("reconnect_error", (error: Error) => {
        console.error("WebSocket reconnection failed:", error);
        this.reconnectAttempts++;
      });

      this.socket.on("reconnect_failed", () => {
        console.error("WebSocket reconnection failed permanently");
      });
    });
  }

  disconnect(): void {
    this.isManualDisconnect = true;
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onCourseProgress(
    courseId: string,
    callback: (data: WebSocketEvent) => void
  ): void {
    if (!this.socket) {
      console.error("WebSocket not connected");
      return;
    }

    // Listen for course-specific progress events
    this.socket.on(`course:${courseId}`, (data: WebSocketEvent) => {
      console.log(`Course ${courseId} progress:`, data);
      callback(data);
    });

    // Also listen for general progress events
    this.socket.on(
      "content_generation_progress",
      (data: WebSocketProgressEvent) => {
        console.log("Content generation progress:", data);
        callback(data);
      }
    );

    // Listen for phase completion events
    const phaseEvents = [
      "job_started",
      "markdown_done",
      "transcript_done",
      "slides_done",
      "audio_done",
      "video_done",
      "upload_done",
      "job_completed",
      "job_failed",
    ] as const;

    phaseEvents.forEach((event) => {
      this.socket?.on(event, (data: Record<string, unknown>) => {
        console.log(`Phase event ${event}:`, data);
        callback({
          type: event,
          data,
          error: event === "job_failed" ? data?.error : undefined,
        } as WebSocketPhaseEvent);
      });
    });

    // Listen for finalize events
    this.socket.on("finalize_started", (data: Record<string, unknown>) => {
      console.log("Finalize started:", data);
      callback({
        type: "finalize_started",
        data,
      } as WebSocketFinalizeEvent);
    });

    this.socket.on("finalize_done", (data: Record<string, unknown>) => {
      console.log("Finalize completed:", data);
      callback({
        type: "finalize_done",
        data,
      } as WebSocketFinalizeEvent);
    });
  }

  onEvent(
    event: string,
    callback: (data: Record<string, unknown>) => void
  ): void {
    if (!this.socket) {
      console.error("WebSocket not connected");
      return;
    }

    this.socket.on(event, (data: Record<string, unknown>) => {
      console.log(`WebSocket event ${event}:`, data);
      callback(data);
    });
  }

  joinCourse(courseId: string): void {
    if (!this.socket || !this.socket.connected) {
      console.error("WebSocket not connected");
      return;
    }
    this.emit("course:join", { courseId });
  }

  joinSession(sessionId: string): void {
    if (!this.socket || !this.socket.connected) {
      console.error("WebSocket not connected");
      return;
    }
    this.emit("join", { room: `session:${sessionId}` });
  }

  // Server expects: socket.emit('progress:subscribe', { courseId }) OR { sessionId }
  subscribeProgress(params: { courseId?: string; sessionId?: string }): void {
    if (!this.socket || !this.socket.connected) {
      console.error("WebSocket not connected");
      return;
    }
    if (!params.courseId && !params.sessionId) {
      console.warn("subscribeProgress called without courseId or sessionId");
      return;
    }
    this.emit(
      "progress:subscribe",
      params as unknown as Record<string, unknown>
    );
  }

  emit(event: string, data?: Record<string, unknown>): void {
    if (!this.socket || !this.socket.connected) {
      console.error("WebSocket not connected, cannot emit event");
      return;
    }

    console.log(`Emitting WebSocket event ${event}:`, data);
    this.socket.emit(event, data);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
    );

    setTimeout(() => {
      if (!this.isManualDisconnect) {
        this.connect().catch((error) => {
          console.error("Reconnection failed:", error);
        });
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  // Utility methods for debugging
  getConnectionState(): string {
    if (!this.socket) return "disconnected";
    return this.socket.connected ? "connected" : "disconnected";
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }
}

// Factory function to create WebSocket service
export const createWebSocketService = (
  config: WebSocketServiceConfig
): WebSocketService => {
  return new WebSocketServiceImpl(config);
};

// Default configuration
export const defaultWebSocketConfig: WebSocketServiceConfig = {
  url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8081/ws",
  token: "",
  reconnectAttempts: 5,
  reconnectDelay: 3000,
};
