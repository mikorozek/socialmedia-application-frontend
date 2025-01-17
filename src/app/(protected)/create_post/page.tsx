"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function CreatePostPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mockPosts, setMockPosts] = useState<{ image: string; caption: string }[]>([]);

  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!image || !caption) {
      alert("Please add an image and a caption.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Add to mock posts list
      setMockPosts((prevPosts) => [
        ...prevPosts,
        { image: imagePreview!, caption },
      ]);
      alert("Mock post created successfully!");
      setImage(null);
      setImagePreview(null);
      setCaption("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sessionStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You need to be logged in to create a post.</p>;
  }

  return (
    <div className="container mx-auto w-[60rem] p-4">
      <button
        onClick={() => router.push("/profile")}
        className="text-blue-600 hover:underline flex items-center mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back to Profile
      </button>
      <h1 className="text-2xl font-bold mb-4 text-[2rem] m-10">Create a Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <div className="flex items-center justify-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-[50rem] max-h-[35rem] object-contain rounded-md"
            />
          ) : (
            <label
              htmlFor="image"
              className="w-32 h-32 flex items-center justify-center border border-dashed border-gray-300 rounded-md cursor-pointer text-gray-500 hover:bg-gray-100"
            >
              <span className="text-sm">+ Add Photo</span>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        <div className="w-full">
          <input
            type="text"
            id="caption"
            value={caption}
            placeholder="Type here a caption for your post..."
            onChange={(e) => setCaption(e.target.value)}
            className="mt-1 w-full block border-b border-gray-900 rounded-md shadow-sm bg-transparent p-5 focus:outline-none focus:border-gray-700 caret-blue-500 text-[1.3rem]"
          />
        </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 font-bold text-[1.3rem]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
