"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addBlogToFireStore, getAllAuthorsFromFireStore, getAllCategoriesFromFireStore } from "@/lib/firebaseFunc";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/auth-context";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoAuthor, setSeoAuthor] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoImage, setSeoImage] = useState("");
  const [editorData, setEditorData] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [slug, setSlug] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [altText, setAltText] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await getAllCategoriesFromFireStore();
      setCategories(fetchedCategories);
    };

    const loadAuthors = async () => {
      const fetchedAuthors = await getAllAuthorsFromFireStore();
      setAuthors(fetchedAuthors);
    };

    loadCategories();
    loadAuthors();
  }, []);

  useEffect(() => {
    setSlug(title.toLowerCase().split(" ").join("-"));
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addBlogToFireStore({
        title,
        description,
        summary,
        category,
        featured,
        seoTitle,
        seoAuthor,
        seoDescription,
        seoImage,
        userId: currentUser?.uid || "",
        editorData,
        tags,
        seoKeywords,
        slug,
        featuredImage,
        altText,
        imageTitle,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setSummary("");
      setCategory("");
      setFeatured(false);
      setSeoTitle("");
      setSeoAuthor("");
      setSeoDescription("");
      setSeoImage("");
      setEditorData("");
      setTags([]);
      setSeoKeywords([]);
      setSlug("");
      setFeaturedImage("");
      setAltText("");
      setImageTitle("");
      
      toast.success("Blog created successfully!");
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const addKeyword = () => {
    if (keywordInput && !seoKeywords.includes(keywordInput)) {
      setSeoKeywords([...seoKeywords, keywordInput]);
      setKeywordInput("");
    }
  };

  return (
    <div className="min-h-[615px] w-full flex flex-col p-4 bg-white rounded-2xl">
      <h2 className="text-3xl w-full flex font-medium justify-center items-center mb-6">
        Create Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div>
              <Label>Summary</Label>
              <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} required />
            </div>

            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch checked={featured} onCheckedChange={setFeatured} />
              <Label>Featured Post</Label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>SEO Title</Label>
              <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} required />
            </div>

            <div>
              <Label>SEO Author</Label>
              <Select value={seoAuthor} onValueChange={setSeoAuthor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.name}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>SEO Description</Label>
              <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} required />
            </div>

            <div>
              <Label>Featured Image URL</Label>
              <Input value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} required />
            </div>

            <div>
              <Label>Image Alt Text</Label>
              <Input value={altText} onChange={(e) => setAltText(e.target.value)} required />
            </div>

            <div>
              <Label>Image Title</Label>
              <Input value={imageTitle} onChange={(e) => setImageTitle(e.target.value)} required />
            </div>
          </div>
        </div>

        <div>
          <Label>Content</Label>
          <Editor onChange={setEditorData} value={editorData} />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading || !title || !description || !category || !seoAuthor}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Create Blog"
          )}
        </Button>
      </form>
    </div>
  );
}
