"use client";

import type { Conversation, Message } from "@/types/types";
import { useState, useEffect, useMemo } from "react";
import CreateConversationModal from "../../components/CreateConversationModal";
import { useSession } from "next-auth/react";

export default function ConversationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadConversations, setUnreadConversations] = useState<Set<number>>(
    new Set(),
  );
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const notificationSound = useMemo(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/notification.mp3");

      audio.addEventListener("loadeddata", () => {
        console.log("Audio loaded successfully");
      });

      audio.addEventListener("error", (e) => {
        console.error("Audio loading error:", e);
      });

      return audio;
    }
    return null;
  }, []);

  const emojis = ["😀", "😂", "😍", "👍", "🙏", "🎉", "❤️"];

  useEffect(() => {
    if (sessionStatus === "loading" || !session?.user?.id) {
      return;
    }

    const ws = new WebSocket(
      `ws://localhost:8080/ws?user_id=${session.user.id}`,
    );

    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);

      const newMessage: Message = {
        user_id: notification.sender_id,
        content: notification.content,
        message_date: new Date().toISOString(),
      };
      notificationSound?.play().catch((err) => {
        console.error("Error playing notification sound:", err);
      });
      if (selectedConversation?.id !== notification.conversation_id) {
        setUnreadConversations(
          (prev) => new Set([...prev, notification.conversation_id]),
        );
      }

      if (selectedConversation?.id === notification.conversation_id) {
        setMessages((prev) => [...prev, newMessage]);
      }

      setConversations((prev) =>
        prev.map((conversation) => {
          if (conversation.id === notification.conversation_id) {
            return {
              ...conversation,
              last_message: newMessage,
            };
          }
          return conversation;
        }),
      );
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [session?.user?.id, selectedConversation?.id]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(
          `/api/conversations/recent?user_id=${session?.user?.id}&limit=50`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recent conversations");
        }
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    const fetchUnreadConversations = async () => {
      try {
        const response = await fetch(
          `/api/conversations/unread?user_id=${session?.user?.id}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch unread conversations");
        }
        const data = await response.json();
        setUnreadConversations(
          new Set(data.map((item: any) => item.conversation_id)),
        );
      } catch (error) {
        console.error("Error fetching unread conversations:", error);
      }
    };
    if (session?.user?.id) {
      fetchConversations();
      fetchUnreadConversations();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation) {
        try {
          const response = await fetch(
            `/api/conversations/messages/get?conversation_id=${selectedConversation.id}&user_id=${session?.user?.id}&limit=50`,
          );
          if (!response.ok) {
            throw new Error("Failed to fetch conversation messages");
          }
          const data = await response.json();
          setMessages(data);
        } catch (error) {}
      } else {
        setMessages([]);
      }
    };
    if (session?.user?.id) {
      fetchMessages();
    }
  }, [selectedConversation, session?.user?.id]);

  const handleCreateConversation = (newConversation: Conversation) => {
    setConversations((prev) => [...prev, newConversation]);
    setSelectedConversation(newConversation);
  };

  const handleSendMessage = async () => {
    if (selectedConversation && newMessage.trim()) {
      try {
        const messageBody = {
          conversation_id: selectedConversation.id,
          sender_id: session?.user?.id,
          content: newMessage,
        };
        const response = await fetch("/api/conversations/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageBody),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();

        setMessages((prev) => [...prev, data]);
        setConversations((prev) =>
          prev.map((conversation) => {
            if (conversation.id === selectedConversation.id) {
              return {
                ...conversation,
                last_message: data,
              };
            }
            return conversation;
          }),
        );
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setEmojiPickerOpen(false);
  };

  const handleConversationSelect = async (conversation: Conversation) => {
    try {
      const response = await fetch("/api/conversations/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_id: conversation.id,
          user_id: session?.user?.id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to mark conversation as read");
      }
      setSelectedConversation(conversation);
      setUnreadConversations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(conversation.id);
        return newSet;
      });
    } catch (error) {
      console.error("Error marking conversation as read:", error);
    }
  };

  const filteredConversations = conversations.filter(
    (conversation) =>
      Array.isArray(conversation.users) &&
      conversation.users.some((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const sortedMessages = useMemo(
    () =>
      [...messages]
        .sort(
          (a, b) =>
            new Date(a.message_date).getTime() -
            new Date(b.message_date).getTime(),
        )
        .reverse(),
    [messages],
  );

  return (
    <div
      className="flex text-white"
      style={{ height: "53.5em", backgroundColor: "#131313" }}
    >
      <div className="w-1/4 bg-gray-1000 p-4 border-r border-gray-700 relative">
        <h2 className="text-lg font-bold mb-6">Conversations</h2>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chats..."
          className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white"
        />

        <ul>
          {filteredConversations.map((conversation) => (
            <li
              key={conversation.id}
              className={`p-2 mb-2 rounded cursor-pointer hover:bg-gray-600 ${
                selectedConversation?.id === conversation.id
                  ? "bg-blue-800 text-white"
                  : "bg-gray-700"
              }`}
              onClick={() => handleConversationSelect(conversation)}
            >
              <div className="font-semibold flex justify-between items-center">
                <span>
                  {conversation.users
                    .filter((user) => user.id != session?.user?.id)
                    .map((user) => user.username)
                    .join(", ")}
                </span>
                {unreadConversations.has(conversation.id) && (
                  <span className="w-3 h-3 mr-2 bg-blue-500 rounded-full" />
                )}
              </div>
              <div className="text-sm text-gray-400 truncate">
                {conversation.last_message ? (
                  <>
                    {conversation.last_message.user_id === session?.user?.id
                      ? "You: "
                      : (conversation.users.find(
                          (user) =>
                            user.id === conversation.last_message?.user_id,
                        )?.username ?? "Unknown user") + ": "}
                    {conversation.last_message.content}
                  </>
                ) : (
                  "No messages yet"
                )}
              </div>
            </li>
          ))}
        </ul>

        {isModalOpen && (
          <CreateConversationModal
            onClose={() => setIsModalOpen(false)}
            onCreateConversation={handleCreateConversation}
          />
        )}
        <button
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-blue-600 text-white text-2xl flex items-center justify-center"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div
          className="p-4 border-b border-gray-700 bg-gray-1000 flex-shrink-0"
          style={{ height: "4em" }}
        >
          {selectedConversation ? (
            <h2 className="text-lg font-bold">
              {conversations
                .find(
                  (conversation) => conversation.id === selectedConversation.id,
                )
                ?.users.filter((user) => user.id != session?.user?.id)
                .map((user) => user.username)
                .join(", ")}
            </h2>
          ) : (
            <h2 className="text-lg font-bold">
              Select a user to start chatting
            </h2>
          )}
        </div>

        <div
          className="flex-1 p-4 overflow-y-auto bg-gray-900 flex flex-col-reverse"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/474x/3d/8c/2f/3d8c2f2c82c1c9ef1e27be645cd1aa17.jpg?nii=t')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backgroundBlendMode: "overlay",
          }}
        >
          {sortedMessages?.map((message, index) => (
            <div key={index}>
              {message.user_id !== session?.user?.id && (
                <p className="ml-2">
                  {
                    selectedConversation?.users.find(
                      (user) => user.id === message.user_id,
                    )?.username
                  }
                </p>
              )}
              <div
                className={`mb-4 max-w-sm p-3 rounded-lg text-white text-lg break-words ${
                  message.user_id === session?.user?.id
                    ? "bg-blue-600 ml-auto text-right"
                    : "bg-gray-700 mr-auto text-left"
                }`}
                style={{ width: "fit-content", maxWidth: "35%" }}
              >
                <p>{message.content}</p>
                <span className="text-xs text-gray-300 block mt-1">
                  {new Date(message.message_date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedConversation && (
          <div className="p-4 border-t border-gray-700 bg-gray-1000 flex items-center flex-shrink-0">
            <button
              className="mr-2 p-2 text-gray-500"
              onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
              style={{ fontSize: "1.5em" }}
            >
              😀
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              style={{
                fontSize: "120%",
                backgroundColor: "transparent",
                border: "0",
                width: "100%",
                height: "100%",
                outline: "none",
                color: "white",
                padding: "0 10px",
              }}
              className="focus:ring-0"
            />

            <button
              onClick={handleSendMessage}
              className="ml-2 p-2 bg-blue-600 text-white rounded-lg"
            >
              ➤
            </button>
          </div>
        )}
      </div>

      {emojiPickerOpen && (
        <div className="absolute bottom-20 right-4 w-1/5 bg-gray-800 border border-gray-700 rounded-lg p-4 grid grid-cols-4 gap-2">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="text-2xl"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
