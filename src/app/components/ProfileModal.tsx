import React from "react";


type User = {
  id: number;
  username: string;
  email: string;
  description: string;
};

type ProfileModalProps = {
  user: User;
  isEditable: boolean;
  onClose: () => void;
};

export default function ProfileModal({ user, isEditable, onClose }: ProfileModalProps) {
  const { username, email, description } = user;

  const handleEdit = () => {
    if (isEditable) {
      alert("Profile edition");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      style={{ fontSize: "1.1em" }}
    >
      <div className="bg-gray-900 rounded-lg p-6 w-1/3 text-white relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="flex flex-col items-center mb-4">
            <h3 className="text-xl font-semibold">{username}</h3>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-lg">{email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Description</p>
            <p className="text-lg">{description}</p>
          </div>
        </div>

        {isEditable && (
          <button
            onClick={handleEdit}
            className="w-full bg-blue-600 p-2 rounded-lg hover:bg-blue-700"
          >
            Edit profile
          </button>
        )}
      </div>
    </div>
  );
}
