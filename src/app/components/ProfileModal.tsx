import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
  email: string;
  description: string;
};

type ProfileModalProps = {
  user: number;
  isEditable: boolean;
  onClose: () => void;
};

export default function ProfileModal({
  user,
  isEditable,
  onClose,
}: ProfileModalProps) {
  const [userData, setUserData] = useState<User | null>(null);
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    description: "",
  });

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/profile?user_id=${user}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data: User = await response.json();
        setUserData(data);
        setFormData({
          username: data.username,
          password: "",
          description: data.description,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [user, session?.user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const payload: Record<string, string | number> = {
        user_id: user,
        username: formData.username.trim(),
        description: formData.description.trim(),
      };

      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      const response = await fetch("/api/users/profile/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile changes.");
      }

      alert("Profile updated successfully!");
      const freshDataResponse = await fetch(
        `/api/users/profile?user_id=${user}`,
      );
      if (!freshDataResponse.ok) {
        throw new Error("Failed to fetch updated profile data");
      }

      const freshData = await freshDataResponse.json();
      setUserData(freshData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile.");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      style={{ fontSize: "1.1em" }}
    >
      <div className="bg-gray-900 rounded-lg p-6 pt-2 w-1/3 text-white relative">
        <div className="flex items-center mb-6 justify-between">
          <h2 className="text-lg font-bold">Profile</h2>
          <div>
            {isEditable && !isEditing && (
              <button
                onClick={handleEditClick}
                className="p-2 rounded-lg hover:bg-gray-700"
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
        </div>

        <div className="mb-6">
          <div className="flex mb-5 items-center">
            <img
              src="https://i.pinimg.com/736x/35/6d/4a/356d4a35587106bc923654e98bf7c309--homemade-cat-treats-siamese-cats.jpg"
              className="w-[4rem] h-[4rem] cursor-pointer rounded-full"
              alt="Profile"
            />
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                className="ml-3 p-2 rounded-lg bg-gray-700 text-white"
              />
            ) : (
              <h3 className="text-xl font-semibold ml-3">
                {userData?.username}
              </h3>
            )}
          </div>
          <div className="mb-4">
            <p className="text-lg">{userData?.email}</p>
            <p className="text-sm text-gray-400">Email</p>
          </div>
          <div className="mb-4">
            {isEditing ? (
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                className="w-full p-2 rounded-lg bg-gray-700 text-white"
              />
            ) : (
              <>
                <p className="text-lg">{userData?.description}</p>
                <p className="text-sm text-gray-400">Description</p>
              </>
            )}
          </div>
          {isEditing && (
            <div className="mb-4">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className="w-full p-2 rounded-lg bg-gray-700 text-white"
              />
              <p className="text-sm text-gray-400 mt-1">Password</p>
            </div>
          )}
        </div>

        {isEditing && (
          <button
            onClick={handleSaveClick}
            className="w-full bg-blue-600 p-2 rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}
