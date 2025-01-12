"use client";

import { useState } from "react";

const mockUsers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const mockMessages: Record<number, { sender: string; text: string }[]> = {
  1: [
    { sender: "other", text: "Hi there!" },
    { sender: "self", text: "Hello, Alice!" },
  ],
  2: [
    { sender: "other", text: "How are you?" },
    { sender: "self", text: "I'm good, Bob!" },
  ],
  3: [
    { sender: "other", text: "What's up?" },
    { sender: "self", text: "Not much, Charlie." },
  ],
};

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleSendMessage = () => {
    if (selectedChat && newMessage.trim()) {
      mockMessages[selectedChat].push({ sender: "self", text: newMessage });
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 border-r border-gray-300">
        <h2 className="text-lg font-bold mb-4">Users</h2>
        <ul>
          {mockUsers.map((user) => (
            <li
              key={user.id}
              className={`p-2 mb-2 rounded cursor-pointer ${
                selectedChat === user.id ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => setSelectedChat(user.id)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-300 bg-gray-200">
          {selectedChat ? (
            <h2 className="text-lg font-bold">
              {mockUsers.find((user) => user.id === selectedChat)?.name}
            </h2>
          ) : (
            <h2 className="text-lg font-bold">Select a user to start chatting</h2>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {selectedChat && mockMessages[selectedChat]?.map((message, index) => (
            <div
              key={index}
              className={`mb-2 max-w-xs p-2 rounded-lg text-white ${
                message.sender === "self"
                  ? "bg-blue-500 self-end"
                  : "bg-gray-500 self-start"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        {selectedChat && (
          <div className="p-4 border-t border-gray-300 bg-gray-100 flex items-center">
            <button
              className="mr-2 p-2 text-gray-500"
              onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
            >
              😀
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
            >
              ➤
            </button>
          </div>
        )}
      </div>

      {/* Emoji Picker */}
      {emojiPickerOpen && (
        <div className="w-1/4 h-full border-l border-gray-300 bg-gray-100">
          <p className="p-4">[Emoji picker placeholder]</p>
        </div>
      )}
    </div>
  );
}
