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
      <div className="bg-gray-900 rounded-lg p-6 pt-2 w-1/3 text-white relative">
        <div className="flex items-center mb-6">
          <h2 className="text-lg font-bold mr-[29rem]">Profile</h2>
          {isEditable && (
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg hover:bg-gray-700 mr-[0.5rem]"
          >
            🖊
          </button>
        )}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 rounded-lg hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="flex mb-5 items-center">
            <img 
              src="https://i.pinimg.com/736x/35/6d/4a/356d4a35587106bc923654e98bf7c309--homemade-cat-treats-siamese-cats.jpg"
              className="w-[4rem] h-[4rem] cursor-pointer rounded-full">
            </img>
            <h3 className="text-xl font-semibold ml-3">{username}</h3>
          </div>
          <div className="mb-4">
            <p className="text-lg">{email}</p>
            <p className="text-sm text-gray-400">Email</p>
          </div>
          <div>
            <p className="text-lg">{description}</p>
            <p className="text-sm text-gray-400">Description</p>
          </div>
        </div>

      </div>
    </div>
  );
}
