"use client";

import { useState } from "react";

const mockUsers = [
  { id: 1, name: "Alice", lastMessage: "Hi there! How are you?" },
  { id: 2, name: "Bob", lastMessage: "Did you finish the project?" },
  { id: 3, name: "Charlie", lastMessage: "Let's catch up soon!" },
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

  const emojis = ["😀", "😂", "😍", "👍", "🙏", "🎉", "❤️"];

  const handleSendMessage = () => {
    if (selectedChat && newMessage.trim()) {
      mockMessages[selectedChat].push({ sender: "self", text: newMessage });
      setNewMessage("");
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setEmojiPickerOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white" style={{ height: "53.5em" }}>
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-800 p-4 border-r border-gray-700">
        <h2 className="text-lg font-bold mb-4">Users</h2>
        <ul>
          {mockUsers.map((user) => (
            <li
              key={user.id}
              className={`p-2 mb-2 rounded cursor-pointer ${
                selectedChat === user.id ? "bg-blue-600 text-white" : "bg-gray-700"
              }`}
              onClick={() => setSelectedChat(user.id)}
            >
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-gray-400 truncate">{user.lastMessage}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-800 flex-shrink-0" style={{ height: "4em" }}>
          {selectedChat ? (
            <h2 className="text-lg font-bold">
              {mockUsers.find((user) => user.id === selectedChat)?.name}
            </h2>
          ) : (
            <h2 className="text-lg font-bold">Select a user to start chatting</h2>
          )}
        </div>

        {/* Messages */}
        <div
          className="flex-1 p-4 overflow-y-auto bg-gray-900"
          style={{ backgroundImage: "url('https://i.pinimg.com/474x/3d/8c/2f/3d8c2f2c82c1c9ef1e27be645cd1aa17.jpg?nii=t')", backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "rgba(0, 0, 0, 0.7)", backgroundBlendMode: "overlay" }}
        >
          {selectedChat && mockMessages[selectedChat]?.map((message, index) => (
            <div
              key={index}
              className={`mb-4 max-w-md p-4 rounded-lg text-white text-lg ${
                message.sender === "self"
                  ? "bg-blue-600 ml-auto text-right"
                  : "bg-gray-700 mr-auto text-left"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        {selectedChat && (
          <div className="p-4 border-t border-gray-700 bg-gray-800 flex items-center flex-shrink-0" style={{ height: "5em" }}>
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
              className="flex-1 p-2 border rounded-lg bg-gray-700 text-white"
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

      {/* Emoji Picker */}
      {emojiPickerOpen && (
        <div className="absolute bottom-20 right-4 w-1/4 bg-gray-800 border border-gray-700 rounded-lg p-4 grid grid-cols-4 gap-2">
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
