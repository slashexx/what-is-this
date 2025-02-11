"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export function AddTagsPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagId = `TAG${Date.now()}`;
      await setDoc(doc(db, "tags", tagId), {
        name,
        slug,
        description,
        createdAt: new Date(),
      });

      setName("");
      setSlug("");
      setDescription("");
      toast.success("Tag added successfully!");
    } catch (error) {
      console.error("Error adding tag:", error);
      toast.error("Failed to add tag");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setSlug(name.toLowerCase().split(" ").join("-"));
  }, [name]);

  return (
    <div className="min-h-[615px] w-full flex flex-col p-4 bg-white rounded-2xl">
      <h2 className="text-3xl w-full flex font-medium justify-center items-center mb-6">
        Add Tag
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto w-full">
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter tag name"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">
            Slug
          </label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="tag-slug"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter tag description"
            className="min-h-[100px]"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading || !name || !slug || !description}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Add Tag"
          )}
        </Button>
      </form>
    </div>
  );
}
