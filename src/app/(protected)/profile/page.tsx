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
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md">
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
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
