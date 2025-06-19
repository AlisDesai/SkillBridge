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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500/12 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl shadow-emerald-500/25">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
            <div className="text-xl font-semibold bg-gradient-to-r from-white via-gray-100 to-slate-200 bg-clip-text text-transparent pb-4">
              Loading conversations...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if match is not accepted
  if (error && matchId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500/12 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-screen px-4">
          <div className="text-center bg-gray-950/40 backdrop-blur-xl border border-gray-800/40 rounded-3xl p-12 max-w-md shadow-2xl">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-red-400/20 via-red-500/15 to-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <svg
                  className="w-10 h-10 text-red-400"
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
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-4 pb-2">
              Chat Not Available
            </h3>
            <p className="text-red-400 mb-8 text-lg leading-relaxed pb-4">
              {error}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/matches")}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-emerald-500/30"
              >
                View Matches
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-slate-300 font-semibold rounded-xl hover:bg-gray-700/60 hover:border-gray-600/50 transition-all duration-300"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500/12 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-emerald-400/60 rounded-full animate-ping shadow-lg shadow-emerald-400/30"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-green-400/70 rounded-full animate-ping delay-1000 shadow-lg shadow-green-400/30"></div>
        <div className="absolute bottom-32 left-1/3 w-2.5 h-2.5 bg-teal-400/50 rounded-full animate-ping delay-2000 shadow-lg shadow-teal-400/30"></div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-gray-950/50"></div>
      </div>

      <div className="relative z-10 p-6 h-screen flex gap-6">
        {/* Conversations List */}
        <div className="w-1/3 bg-gray-950/25 backdrop-blur-xl border border-gray-800/30 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-gray-800/40">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent pb-2">
                Messages
              </h3>
              <div className="flex items-center gap-3">
                <div
                  className={`relative w-3 h-3 rounded-full ${
                    isConnected ? "bg-emerald-400" : "bg-red-400"
                  } animate-pulse shadow-md`}
                  title={isConnected ? "Connected" : "Disconnected"}
                >
                  <div
                    className={`absolute inset-0 w-3 h-3 rounded-full ${
                      isConnected ? "bg-emerald-400" : "bg-red-400"
                    } animate-ping opacity-15`}
                  ></div>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {isConnected ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <p className="text-slate-500 text-sm pb-2">
              Connect with your skill exchange partners
            </p>
          </div>

          <div className="h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-400/25 via-green-500/20 to-teal-600/25 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                  <svg
                    className="w-10 h-10 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2 pb-1">
                  No conversations yet
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed pb-4">
                  Start connecting with other learners to begin your skill
                  exchange journey
                </p>
                <button
                  onClick={() => navigate("/matches")}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/30"
                >
                  Find Matches
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {conversations.map((conversation) => {
                  const otherParticipant = conversation.participants.find(
                    (p) => p._id !== userId
                  );
                  const isSelected =
                    selectedConversation?._id === conversation._id;

                  return (
                    <div
                      key={conversation._id}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        setError("");
                      }}
                      className={`group p-4 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-102 relative overflow-hidden ${
                        isSelected
                          ? "bg-gradient-to-r from-emerald-400/15 via-green-500/10 to-teal-600/15 border border-emerald-400/25 shadow-lg shadow-emerald-500/15"
                          : "bg-gray-900/25 backdrop-blur-sm border border-gray-800/25 hover:bg-gray-900/40 hover:border-gray-700/30 shadow-md"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/8 via-green-500/4 to-teal-600/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      )}

                      <div className="relative flex items-center gap-4">
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold ${
                              isSelected
                                ? "bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white shadow-emerald-500/20"
                                : "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 text-white"
                            }`}
                          >
                            {otherParticipant?.name?.charAt(0)?.toUpperCase() ||
                              "U"}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-950 animate-pulse shadow-md shadow-emerald-400/40"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p
                              className={`font-semibold truncate ${
                                isSelected ? "text-white" : "text-white"
                              }`}
                            >
                              {otherParticipant?.name || "Unknown User"}
                            </p>
                            {conversation.lastMessageAt && (
                              <span
                                className={`text-xs ${
                                  isSelected
                                    ? "text-emerald-200"
                                    : "text-slate-500"
                                }`}
                              >
                                {formatTime(conversation.lastMessageAt)}
                              </span>
                            )}
                          </div>
                          {conversation.lastMessage && (
                            <p
                              className={`text-sm truncate leading-relaxed pb-1 ${
                                isSelected
                                  ? "text-emerald-100"
                                  : "text-slate-500"
                              }`}
                            >
                              {conversation.lastMessage.text}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-gray-950/25 backdrop-blur-xl border border-gray-800/30 rounded-3xl flex flex-col overflow-hidden">
          {selectedConversation && !error ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-800/40 bg-gradient-to-r from-gray-900/30 via-gray-950/20 to-gray-900/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                        {selectedConversation.participants
                          .find((p) => p._id !== userId)
                          ?.name?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-gray-950 animate-pulse shadow-md shadow-emerald-400/40"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white pb-1">
                        {selectedConversation.participants.find(
                          (p) => p._id !== userId
                        )?.name || "Unknown User"}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isConnected ? "bg-emerald-400" : "bg-red-400"
                          } animate-pulse`}
                        ></div>
                        <p className="text-sm text-slate-500">
                          {isConnected ? "Active now" : "Offline"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  {messages.map((message, index) => {
                    const isOwnMessage = message.sender._id === userId;
                    const showDate =
                      index === 0 ||
                      formatDate(messages[index - 1].createdAt) !==
                        formatDate(message.createdAt);

                    return (
                      <div key={message._id}>
                        {showDate && (
                          <div className="text-center my-6">
                            <div className="inline-block bg-gray-900/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-800/30">
                              <span className="text-xs text-slate-400 font-medium">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                          </div>
                        )}

                        <div
                          className={`flex ${
                            isOwnMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`group flex items-end gap-3 max-w-[75%] ${
                              isOwnMessage ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            {!isOwnMessage && (
                              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                {message.sender.name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "U"}
                              </div>
                            )}

                            <div
                              className={`relative px-5 py-3 rounded-2xl shadow-md ${
                                isOwnMessage
                                  ? "bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white shadow-emerald-500/15"
                                  : "bg-gray-900/50 backdrop-blur-sm border border-gray-800/30 text-white shadow-gray-900/15"
                              } ${message.isTemporary ? "opacity-70" : ""}`}
                            >
                              {isOwnMessage && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              )}

                              <p className="text-sm leading-relaxed relative pb-1">
                                {message.text}
                              </p>
                              <div className="flex items-center justify-end gap-2 mt-2">
                                <p
                                  className={`text-xs ${
                                    isOwnMessage
                                      ? "text-emerald-100"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {formatTime(message.createdAt)}
                                </p>
                                {message.isTemporary && (
                                  <div className="w-3 h-3 border border-current rounded-full animate-spin opacity-60"></div>
                                )}
                                {isOwnMessage && !message.isTemporary && (
                                  <svg
                                    className="w-4 h-4 text-emerald-100"
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
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-800/40 bg-gradient-to-r from-gray-900/40 via-gray-950/20 to-gray-900/40">
                <form onSubmit={sendMessage}>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage(e);
                          }
                        }}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full px-5 py-3 pr-16 bg-gray-900/50 backdrop-blur-sm border border-gray-800/30 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all duration-300 resize-none custom-scrollbar"
                        style={{
                          minHeight: "44px",
                          maxHeight: "120px",
                        }}
                        disabled={sending || !isConnected || error}
                      />

                      {/* Emoji button */}
                      <button
                        type="button"
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-colors duration-300 rounded-lg hover:bg-gray-800/30"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        !newMessage.trim() || sending || !isConnected || error
                      }
                      className="group relative w-12 h-12 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                      {sending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                      ) : (
                        <svg
                          className="w-5 h-5 mx-auto relative transform group-hover:translate-x-0.5 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Status indicators */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      {!isConnected && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                          <span>Reconnecting...</span>
                        </div>
                      )}
                      {sending && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span>Sending message...</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-slate-600">
                      Press Enter to send
                    </div>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center px-6">
              <div>
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-400/25 via-green-500/20 to-teal-600/25 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <svg
                    className="w-12 h-12 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-4 pb-2">
                  {error
                    ? "Please select another conversation"
                    : "Select a conversation"}
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md pb-6">
                  {error
                    ? "Choose from your available conversations to continue chatting"
                    : "Choose a conversation from the sidebar to start exchanging knowledge and building connections"}
                </p>
                {!error && conversations.length === 0 && (
                  <button
                    onClick={() => navigate("/matches")}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-emerald-500/30"
                  >
                    Find Learning Partners
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #059669);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #047857);
        }

        /* Auto-resize textarea */
        textarea {
          field-sizing: content;
        }
      `}</style>
    </div>
  );
}
