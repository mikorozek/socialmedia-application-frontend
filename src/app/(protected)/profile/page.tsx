"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ProfilePage() {
    const { data: session, status: sessionStatus, update } = useSession();

    // Mock user data
    const mockUser = {
        username: session?.user?.name || "MockUser",
        email: session?.user?.email || "mockuser@example.com",
        posts: 42,
        friends: 128,
    };

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: mockUser.username,
        email: mockUser.email,
    });

    const mockPhotos = [
        "https://avatars.mds.yandex.net/i?id=f64710d1da958f2fc884be6cb109e1faa58442e8ddd00328-5268818-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=5c435ce2f5d829ca6bb9063ac5b719edf517573e-4760093-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=6ca41deaa718f85ac31ebf328e03e8aa5a4d373c-8803246-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=fd80bee0471ddeb3e29af02e5cd18894bf4bc4c8-8211098-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=ef11d5450b7f8b3ec74d1cba2d81a1ff6fb485a6-4275191-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=e5ef885c198986dafc8d71d029b794876875ef8a-10544851-images-thumbs&n=13",
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
            console.log("Mock Save: ", formData);
            await update(); // Mock updating session
            setEditing(false);
        } catch (error) {
            console.error("Failed to save profile changes", error);
        }
    };

    if (sessionStatus === "loading") {
        return <p>Loading...</p>;
    }

    if (!session) {
        return <p>You need to be logged in to view this page.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-[rgb(20,20,20)] border-1px">
            <div className="flex flex-col gap-4">
                {/* Username, Email, and Stats */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-4">
                    <div className="flex flex-col gap-2">
                        <div>
                            {editing ? (
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="border rounded px-2 py-1 w-full bg-transparent"
                                />
                            ) : (
                                <h1 className="text-2xl font-bold">{formData.username}</h1>
                            )}
                        </div>
                        <div>
                            {editing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="border rounded px-2 py-1 w-full bg-transparent"
                                />
                            ) : (
                                <h2 className="text-lg font-bold text-gray-300">{formData.email}</h2>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8">
                        <p className="text-sm text-gray-400">
                            Posts: <span className="text-white font-bold">{mockUser.posts}</span>
                        </p>
                        <p className="text-sm text-gray-400">
                            Friends: <span className="text-white font-bold">{mockUser.friends}</span>
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    {editing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setEditing(false)}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            🖊Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* User Photos */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Your Photos</h2>
                <div className="grid grid-cols-3 gap-0">
                    {mockPhotos.map((photo, index) => (
                        <img
                            key={index}
                            src={photo}
                            alt={`User photo ${index + 1}`}
                            className="w-full aspect-square object-cover"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
