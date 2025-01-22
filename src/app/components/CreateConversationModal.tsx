import React, { useState, useEffect } from "react";
import type { Conversation, User } from "@/types/types";
import { useSession } from "next-auth/react";

interface CreateConversationModalProps {
  onClose: () => void;
  onCreateConversation: (newConversation: Conversation) => void;
}

export default function CreateConversationModal({
  onClose,
  onCreateConversation,
}: CreateConversationModalProps) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length >= 3) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/users/search?query=${encodeURIComponent(searchQuery)}`,
          );
          if (!response.ok) {
            throw new Error("Failed to fetch users");
          }
          const users = await response.json();
          setFilteredUsers(users);
        } catch (error) {
          console.error("Error searching users:", error);
          setFilteredUsers([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setFilteredUsers([]);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleUserClick = (user: User) => {
    if (selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
      setSelectedUsers(
        selectedUsers.filter((selectedUser) => selectedUser.id !== user.id),
      );
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) return;
    try {
      const response = await fetch("/api/conversations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_ids: [
            session?.user?.id,
            ...selectedUsers.map((user) => user.id),
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const newConversation = await response.json();
      onCreateConversation(newConversation);
      onClose();
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const isUserSelected = (user: User) =>
    selectedUsers.some((selectedUser) => selectedUser.id === user.id);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      style={{ fontSize: "1.1em" }}
    >
      <div className="bg-gray-900 rounded-lg p-6 w-1/3 text-white">
        <h2 className="text-lg font-bold mb-4">Create New Chat</h2>

        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-blue-600 px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{user.username}</span>
                <button
                  onClick={() => handleUserClick(user)}
                  className="text-sm hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search users..."
          className="w-full p-2 mb-4 rounded-lg bg-gray-800 text-white"
        />

        <ul className="space-y-2 max-h-64 overflow-y-auto mb-4">
          {isLoading ? (
            <li className="p-2 text-gray-400">Loading...</li>
          ) : filteredUsers?.length > 0 ? (
            filteredUsers.map((user) => (
              <li
                key={user.id}
                className={`p-2 rounded-lg cursor-pointer ${
                  isUserSelected(user)
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => handleUserClick(user)}
              >
                {user.username}
              </li>
            ))
          ) : searchQuery.length >= 2 ? (
            <li className="p-2 text-gray-400">No users found</li>
          ) : (
            <li className="p-2 text-gray-400">
              Type at least 2 characters to search
            </li>
          )}
        </ul>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-red-600 p-2 rounded-lg hover:bg-red-700"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateConversation}
            disabled={selectedUsers.length === 0}
            className={`flex-1 p-2 rounded-lg ${
              selectedUsers.length > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Create Chat
          </button>
        </div>
      </div>
    </div>
  );
}
