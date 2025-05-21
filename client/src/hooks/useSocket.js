import { useEffect, useRef } from "react";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function useSocket(token) {
  const socket = useRef(null);

  useEffect(() => {
    if (token) {
      socket.current = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket"],
      });

      socket.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [token]);

  return socket.current;
}
