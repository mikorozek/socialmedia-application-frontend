import React, { useState } from "react";

export default function CreateChatModal({ users, onClose, onCreateChat }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(query)
      )
    );
  };

  const handleUserClick = (user) => {
    onCreateChat(user.user_id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      style={{ fontSize: "1.1em" }}
    >
      <div className="bg-gray-900 rounded-lg p-6 w-1/3 text-white">
        <h2 className="text-lg font-bold mb-4">Create New Chat</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search users..."
          className="w-full p-2 mb-4 rounded-lg bg-gray-800 text-white"
        />
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {filteredUsers.map((user) => (
            <li
              key={user.user_id}
              className="p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-blue-700"
              onClick={() => handleUserClick(user)}
            >
              {user.username}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 p-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
