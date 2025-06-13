import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.socket) {
      return this.socket;
    }

    const serverUrl =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

    this.socket = io(serverUrl, {
      auth: { token },
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
    return this.socket;
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ Connected to socket server");
      this.connected = true;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from socket server:", reason);
      this.connected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔴 Socket connection error:", error.message);
      this.connected = false;
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
      this.connected = true;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      console.log("🔌 Socket disconnected");
    }
  }

  emit(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("Socket not connected, cannot emit:", event);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Chat specific methods
  joinConversation(conversationId) {
    this.emit("joinConversation", conversationId);
  }

  leaveConversation(conversationId) {
    this.emit("leaveConversation", conversationId);
  }

  sendMessage(data) {
    this.emit("sendMessage", data);
  }

  onMessageReceived(callback) {
    this.on("messageReceived", callback);
  }

  onUserOnline(callback) {
    this.on("userOnline", callback);
  }

  onUserOffline(callback) {
    this.on("userOffline", callback);
  }

  // Notification methods
  onNotificationReceived(callback) {
    this.on("notificationReceived", callback);
  }

  isConnected() {
    return this.connected && this.socket?.connected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
