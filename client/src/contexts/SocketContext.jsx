import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ token, children }) => {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (token && !socket.current) {
      socket.current = io(
        import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
        {
          auth: { token },
          transports: ["websocket"],
          withCredentials: true,
        }
      );

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
        setIsConnected(true);
      });

      socket.current.on("disconnect", () => {
        console.log("Disconnected from socket server");
        setIsConnected(false);
      });

      socket.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
        console.log("🔌 Socket disconnected on cleanup");
      }
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket: socket.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
