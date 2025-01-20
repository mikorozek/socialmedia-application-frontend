"use client";

import { useState, useEffect } from "react";

export default function ChatsPage() {
  const [userId, setUserId] = useState(1);
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [socket, setSocket] = useState(null);

  const emojis = ["😀", "😂", "😍", "👍", "🙏", "🎉", "❤️"];

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/ws?user_id=${userId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.conversation_id === selectedChat) {
        setMessages((prev) => [...prev, data]);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId, selectedChat]);

  useEffect(() => {
    async function fetchChats() {
      const response = await fetch(`/api/conversations/recent?user_id=${userId}&limit=50`);
      const data = await response.json();
      setChats(data);
    }
    fetchChats();
  }, [userId]);

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(`/api/users/search?query=`);
      const data = await response.json();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      async function fetchMessages() {
        const response = await fetch(
          `/api/conversations/messages/get?conversation_id=${selectedChat}&user_id=${userId}&limit=50`
        );
        const data = await response.json();
        setMessages(data);
      }
      fetchMessages();
    }
  }, [selectedChat, userId]);

  const handleCreateChat = async () => {
    const selectedUsers = prompt("Enter usernames for the new chat, separated by commas:");
    if (selectedUsers) {
      const usernames = selectedUsers.split(",").map((name) => name.trim());
      const userIds = users
        .filter((user) => usernames.includes(user.username))
        .map((user) => user.user_id);
      if (userIds.length >= 2) {
        try {
          const response = await fetch(`/api/conversations/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_ids: userIds }),
          });
          const newChat = await response.json();
          setChats((prev) => [...prev, newChat]);
          alert("Chat created successfully!");
        } catch (error) {
          console.error("Failed to create chat", error);
          alert("Error creating chat. Please try again.");
        }
      } else {
        alert("A chat must include at least two users.");
      }
    }
  };

  const handleSendMessage = async () => {
    if (selectedChat && newMessage.trim()) {
      await fetch(`/api/conversations/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: selectedChat,
          sender_id: userId,
          content: newMessage,
        }),
      });
      setNewMessage("");
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setEmojiPickerOpen(false);
  };

  const filteredChats = chats.filter((chat) =>
    chat.users.some((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex text-white" style={{ height: "53.5em", backgroundColor: "#131313" }}>
      <div className="w-1/4 bg-gray-1000 p-4 border-r border-gray-700 relative">
        <h2 className="text-lg font-bold mb-6">Chats</h2>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chats..."
          className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white"
        />

        <ul>
          {filteredChats.map((chat) => (
            <li
              key={chat.id}
              className={`p-2 mb-2 rounded cursor-pointer hover:bg-gray-600 ${
                selectedChat === chat.id ? "bg-blue-800 text-white" : "bg-gray-700"
              }`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="font-semibold">
                {chat.users.map((user) => user.username).join(", ")}
              </div>
              <div className="text-sm text-gray-400 truncate">
                {chat.last_message?.content}
              </div>
            </li>
          ))}
        </ul>

        <button
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-blue-600 text-white text-2xl flex items-center justify-center"
          onClick={handleCreateChat}
        >
          +
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-700 bg-gray-1000 flex-shrink-0" style={{ height: "4em" }}>
          {selectedChat ? (
            <h2 className="text-lg font-bold">
              {chats.find((chat) => chat.id === selectedChat)?.users
                .map((user) => user.username)
                .join(", ")}
            </h2>
          ) : (
            <h2 className="text-lg font-bold">Select a user to start chatting</h2>
          )}
        </div>

        <div
          className="flex-1 p-4 overflow-y-auto bg-gray-900"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/474x/3d/8c/2f/3d8c2f2c82c1c9ef1e27be645cd1aa17.jpg?nii=t')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backgroundBlendMode: "overlay",
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 max-w-sm p-3 rounded-lg text-white text-lg break-words ${
                message.user_id === userId
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
          ))}
        </div>

        {selectedChat && (
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
            <button key={emoji} onClick={() => handleEmojiClick(emoji)} className="text-2xl">
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
