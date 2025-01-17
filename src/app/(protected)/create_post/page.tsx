"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CreatePostPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mockPosts, setMockPosts] = useState<{ image: string; caption: string }[]>([]);

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Post</h1>
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
            className="mt-1 w-full block border border-gray-900 rounded-md shadow-sm bg-transparent p-5"
          />
        </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Mock Posts</h2>
        <div className="space-y-4">
          {mockPosts.map((post, index) => (
            <div key={index} className="border p-4 rounded-md shadow-sm">
              <img
                src={post.image}
                alt="Uploaded Post"
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <p className="text-gray-700">{post.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
