"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ProfilePage() {
    const { data: session, status: sessionStatus, update } = useSession();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: session?.user?.name || "",
        email: session?.user?.email || "",
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
            // Mock updating session
            await update();
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
        <div className="max-w-4xl mx-auto p-6 bg-[rgb(20,20,20)]">
            <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
            <div className="flex flex-col gap-4">
                {/* Username */}
                <div>
                    <label className="block text-sm font-medium">Username</label>
                    {editing ? (
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    ) : (
                        <p className="text-lg">{formData.username}</p>
                    )}
                </div>
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    {editing ? (
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    ) : (
                        <p className="text-lg">{formData.email}</p>
                    )}
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
                            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            <span>🖊️</span> Edit Profile
                        </button>
                    )}
                </div>
            </div>
            {/* User Photos */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Your Photos</h2>
                <div className="grid grid-cols-3 gap-4">
                    {mockPhotos.map((photo, index) => (
                        <img
                            key={index}
                            src={photo}
                            alt={`User photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md border cursor-pointer hover:opacity-90"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
