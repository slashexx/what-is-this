"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/users/uiTwo/button";
import { Input } from "@/components/ui/input";
import { ClipLoader } from "react-spinners";
import { MdRefresh, MdDelete } from "react-icons/md";

export default function MediaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState([]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/media/getAllMedia");
      if (!response.ok) throw new Error("Failed to fetch media");
      const data = await response.json();
      setMedia(data.data || []);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      fetchMedia();
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#4D413E]">Media Library</h1>
        <div className="flex items-center gap-3">
          <input
            type="file"
            id="fileUpload"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <label htmlFor="fileUpload">
            <Button
              className="bg-[#695d56] text-white hover:bg-[#4D413E] cursor-pointer"
              as="span"
            >
              Upload Media
            </Button>
          </label>
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-[200px] bg-[#F3EAE7]"
          />
          <button
            onClick={() => fetchMedia()}
            className="p-2 rounded-lg border border-[#85716B] text-[#85716B] hover:bg-[#F3EAE7]"
          >
            {loading ? <ClipLoader size={20} color="#85716B" /> : <MdRefresh size={20} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <div key={item.id} className="relative group">
            <img
              src={item.url}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <button
                onClick={() => handleDelete(item.id)}
                className="text-white p-2 hover:text-red-500"
              >
                <MdDelete size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
