import { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import api from "../utils/api";

export default function ChatPage() {
  const location = useLocation();
  const { matchId } = useParams();
  const navigate = useNavigate();
  const {
    isConnected,
    joinConversation,
    leaveConversation,
    onMessageReceived,
    offMessageReceived,
  } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load conversations on component mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        setError("");

        // If matchId is provided, try to get/create conversation for that match
        if (matchId) {
          try {
            const matchRes = await api.get(
              `/chats/conversations/match/${matchId}`
            );
            setSelectedConversation(matchRes.data);

            // Also load all conversations for the sidebar
            const allRes = await api.get("/chats/conversations");
            setConversations(allRes.data);
          } catch (matchError) {
            console.error("Match conversation error:", matchError);
            if (matchError.response?.status === 403) {
              setError(
                matchError.response.data.message ||
                  "Please wait for match approval before messaging!"
              );
            } else {
              setError("Failed to load conversation");
            }

            // Still try to load other conversations
            try {
              const allRes = await api.get("/chats/conversations");
              setConversations(allRes.data);
            } catch (err) {
              console.error("Failed to load conversations:", err);
            }
          }
        } else {
          // Load all conversations
          const res = await api.get("/chats/conversations");
          setConversations(res.data);

          // If coming from UserDetailPage with userId, find conversation
          if (location.state?.userId) {
            const conversation = res.data.find((conv) =>
              conv.participants.some((p) => p._id === location.state.userId)
            );
            if (conversation) {
              setSelectedConversation(conversation);
            }
          } else if (res.data.length > 0) {
            setSelectedConversation(res.data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
        setError("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [location.state, matchId]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation && !error) {
      loadMessages(selectedConversation._id);
      joinConversation(selectedConversation._id);

      return () => {
        leaveConversation(selectedConversation._id);
      };
    }
  }, [selectedConversation, error, joinConversation, leaveConversation]);

  // Listen for new messages with better real-time handling
  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log("Real-time message received:", message);

      // Add message to current conversation if it matches
      if (message.conversationId === selectedConversation?._id) {
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const messageExists = prev.some((msg) => msg._id === message._id);
          if (messageExists) return prev;
          return [...prev, message];
        });
      }

      // Update conversation list with new last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === message.conversationId
            ? {
                ...conv,
                lastMessage: message,
                lastMessageAt: message.createdAt || new Date(),
              }
            : conv
        )
      );
    };

    if (onMessageReceived) {
      onMessageReceived(handleNewMessage);
      return () => {
        if (offMessageReceived) {
          offMessageReceived(handleNewMessage);
        }
      };
    }
  }, [selectedConversation, onMessageReceived, offMessageReceived]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (conversationId) => {
    try {
      const res = await api.get(
        `/chats/conversations/${conversationId}/messages`
      );
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sending || error) return;

    setSending(true);
    const tempMessage = {
      _id: Date.now().toString(),
      text: newMessage.trim(),
      sender: { _id: userId, name: "You" },
      createdAt: new Date(),
      conversationId: selectedConversation._id,
      isTemporary: true,
    };

    // Optimistically add message to UI
    setMessages((prev) => [...prev, tempMessage]);
    const messageText = newMessage.trim();
    setNewMessage("");

    try {
      const messageData = {
        conversationId: selectedConversation._id,
        text: messageText,
      };

      // Send via API
      const response = await api.post("/chats/messages", messageData);

      // Remove temporary message and replace with real one
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));

      // The real message will come through socket, but if not, add it manually
      if (response.data) {
        setMessages((prev) => {
          const messageExists = prev.some(
            (msg) => msg._id === response.data._id
          );
          if (!messageExists) {
            return [...prev, response.data];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);

      // Remove temporary message on error
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));

      // Restore message text
      setNewMessage(messageText);

      if (error.response?.status === 403) {
        setError(
          error.response.data.message ||
            "Please wait for match approval before messaging!"
        );
      }
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading conversations...</div>
      </div>
    );
  }

  // Show error if match is not accepted
  if (error && matchId) {
    return (
      <div className="h-[calc(100vh-150px)] flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-md p-8 max-w-md">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Chat Not Available
          </h3>
          <p className="text-red-500 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/matches")}
              className="w-full px-4 py-2 bg-[#4A6FFF] text-white rounded-lg hover:bg-[#3A5FEF] transition-colors"
            >
              View Matches
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-150px)] flex gap-6">
      {/* Conversations List */}
      <div className="w-1/3 bg-white rounded-2xl shadow-md p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
            title={isConnected ? "Connected" : "Disconnected"}
          />
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No conversations yet
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => {
              const otherParticipant = conversation.participants.find(
                (p) => p._id !== userId
              );
              const isSelected = selectedConversation?._id === conversation._id;

              return (
                <div
                  key={conversation._id}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    setError("");
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? "bg-[#4A6FFF] text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                        isSelected
                          ? "bg-white text-[#4A6FFF]"
                          : "bg-[#4A6FFF] text-white"
                      }`}
                    >
                      {otherParticipant?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate ${
                          isSelected ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {otherParticipant?.name || "Unknown User"}
                      </p>
                      {conversation.lastMessage && (
                        <p
                          className={`text-sm truncate ${
                            isSelected ? "text-gray-200" : "text-gray-500"
                          }`}
                        >
                          {conversation.lastMessage.text}
                        </p>
                      )}
                    </div>
                    {conversation.lastMessageAt && (
                      <span
                        className={`text-xs ${
                          isSelected ? "text-gray-200" : "text-gray-400"
                        }`}
                      >
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-2xl shadow-md flex flex-col">
        {selectedConversation && !error ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4A6FFF] rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedConversation.participants
                    .find((p) => p._id !== userId)
                    ?.name?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedConversation.participants.find(
                      (p) => p._id !== userId
                    )?.name || "Unknown User"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {isConnected ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isOwnMessage = message.sender._id === userId;
                  const showDate =
                    index === 0 ||
                    formatDate(messages[index - 1].createdAt) !==
                      formatDate(message.createdAt);

                  return (
                    <div key={message._id}>
                      {showDate && (
                        <div className="text-center text-xs text-gray-500 mb-2">
                          {formatDate(message.createdAt)}
                        </div>
                      )}
                      <div
                        className={`flex ${
                          isOwnMessage ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                            isOwnMessage
                              ? "bg-[#4A6FFF] text-white"
                              : "bg-gray-100 text-gray-800"
                          } ${message.isTemporary ? "opacity-70" : ""}`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwnMessage ? "text-gray-200" : "text-gray-500"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                            {message.isTemporary && " ⏳"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <form
              onSubmit={sendMessage}
              className="p-4 border-t border-gray-200"
            >
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A6FFF] focus:border-transparent"
                  disabled={sending || !isConnected || error}
                />
                <button
                  type="submit"
                  disabled={
                    !newMessage.trim() || sending || !isConnected || error
                  }
                  className="px-6 py-2 bg-[#4A6FFF] text-white rounded-lg hover:bg-[#3A5FEF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            {error
              ? "Please select another conversation"
              : "Select a conversation to start chatting"}
          </div>
        )}
      </div>
    </div>
  );
}
