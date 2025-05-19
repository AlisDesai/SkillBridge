import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import api from "../utils/api";
import { showError } from "../utils/toast";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
});

export default function ChatPage() {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get("/chat/my-messages");
        setMessages(res.data || []);
      } catch (err) {
        showError("Failed to load chat");
      }
    };

    fetchMessages();

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const message = {
      from: user._id,
      text: text.trim(),
    };

    try {
      await api.post("/chat/send", message);
      socket.emit("sendMessage", message);
      setMessages((prev) => [...prev, { ...message, from: "me" }]);
      setText("");
    } catch (err) {
      showError("Failed to send message");
    }
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-6 h-[calc(100vh-150px)]">
      <h2 className="text-2xl font-semibold text-gray-800">Chat</h2>
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col h-full max-h-full overflow-hidden">
        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${
                msg.from === user._id || msg.from === "me"
                  ? "bg-[#4A6FFF] text-white ml-auto"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatRef} />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#4A6FFF]"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-[#4A6FFF] text-white rounded-xl hover:bg-[#3b5dfc] transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
