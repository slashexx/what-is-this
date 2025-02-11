"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/users/uiTwo/table";
import { Button } from "@/components/users/uiTwo/button";
import { Input } from "@/components/ui/input";
import { ClipLoader } from "react-spinners";
import { MdRefresh, MdEdit, MdDelete } from "react-icons/md";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: "", description: "" });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/categories/getAllCategories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editMode 
        ? `/api/categories/${currentCategory.id}`
        : "/api/categories/create";
      const method = editMode ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentCategory),
      });
      
      if (!response.ok) throw new Error("Failed to save category");
      fetchCategories();
      setCurrentCategory({ name: "", description: "" });
      setEditMode(false);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#4D413E]">Categories</h1>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-[200px] bg-[#F3EAE7]"
          />
          <button
            onClick={() => fetchCategories()}
            className="p-2 rounded-lg border border-[#85716B] text-[#85716B] hover:bg-[#F3EAE7]"
          >
            {loading ? <ClipLoader size={20} color="#85716B" /> : <MdRefresh size={20} />}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#F3EAE7] p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            {editMode ? "Edit Category" : "Add New Category"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Category Name"
              value={currentCategory.name}
              onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
              className="bg-white"
              required
            />
            <Input
              placeholder="Description"
              value={currentCategory.description}
              onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
              className="bg-white"
            />
            <Button type="submit" className="bg-[#695d56] text-white hover:bg-[#4D413E]">
              {editMode ? "Update" : "Add"} Category
            </Button>
          </form>
        </div>

        <div className="bg-[#F3EAE7] rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#695d56]">
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Description</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCurrentCategory(category);
                          setEditMode(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

