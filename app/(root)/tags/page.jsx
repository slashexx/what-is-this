"use client";

import { useState } from "react";
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
import { Pagination } from "@/components/ui/pagination";

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);
  const [isEditTagModalOpen, setIsEditTagModalOpen] = useState(false);
  const [isDeleteTagModalOpen, setIsDeleteTagModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [newTag, setNewTag] = useState({ name: "", description: "", slug: "" });
  const tagsPerPage = 5;

  const tags = [
    {
      name: "Kritika",
      description: "Sample description for Kritika",
      slug: "kritika",
      createdAt: "11/01/2023",
    },
    {
      name: "Tag2",
      description: "Sample description for Tag2",
      slug: "tag2",
      createdAt: "12/01/2023",
    },
    // Add more tags as needed
  ];

  const totalPages = Math.ceil(tags.length / tagsPerPage);
  const currentTags = tags.slice(
    (currentPage - 1) * tagsPerPage,
    currentPage * tagsPerPage
  );

  const openAddTagModal = () => {
    setNewTag({ name: "", description: "", slug: "" });
    setIsAddTagModalOpen(true);
  };

  const closeAddTagModal = () => setIsAddTagModalOpen(false);

  const openEditTagModal = (tag) => {
    setSelectedTag(tag);
    setIsEditTagModalOpen(true);
  };

  const closeEditTagModal = () => setIsEditTagModalOpen(false);

  const openDeleteTagModal = (tag) => {
    setSelectedTag(tag);
    setIsDeleteTagModalOpen(true);
  };

  const closeDeleteTagModal = () => setIsDeleteTagModalOpen(false);

  const handleAddTag = () => {
    if (!newTag.name || !newTag.description || !newTag.slug) {
      alert("Please fill in all fields before adding a tag.");
      return;
    }
  
    const newTagData = {
      ...newTag,
      createdAt: new Date().toLocaleDateString(), // Or use another date format you prefer
    };
  
    setTags((prevTags) => [...prevTags, newTagData]);
    closeAddTagModal();
  };
  
  // Logic for editing a tag
  const handleEditTag = () => {
    if (!selectedTag.name || !selectedTag.description || !selectedTag.slug) {
      alert("Please fill in all fields before saving changes.");
      return;
    }
  
    const updatedTags = tags.map((tag) =>
      tag.slug === selectedTag.slug ? selectedTag : tag
    );
  
    setTags(updatedTags);
    closeEditTagModal();
  };
  
  // Logic for deleting a tag
  const handleDeleteTag = () => {
    const updatedTags = tags.filter((tag) => tag.slug !== selectedTag.slug);
  
    setTags(updatedTags);
    closeDeleteTagModal();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Tags</h1>
        <div className="flex items-center mb-4">
        
      
        <Button onClick={openAddTagModal} variant="solid" className="bg-[#4D413E] text-white rounded px-4 py-2">
          Add New Tag
        </Button>
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ml-3"
        />
        </div>
      </div>

      

      <div className="bg-[#F3EAE7] p-6 rounded-lg shadow-md">
        <Table className="border-none">
          <TableHeader>
            <TableRow>
              <TableHead className="border-none">Tags</TableHead>
              <TableHead className="border-none">Description</TableHead>
              <TableHead className="border-none">Slug</TableHead>
              <TableHead className="border-none">Created at</TableHead>
              <TableHead className="border-none">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTags.map((tag, index) => (
              <TableRow key={index} className="border-none">
                <TableCell className="border-none">{tag.name}</TableCell>
                <TableCell className="border-none">{tag.description}</TableCell>
                <TableCell className="border-none">{tag.slug}</TableCell>
                <TableCell className="border-none">{tag.createdAt}</TableCell>
                <TableCell className="border-none">
                  <Button
                    variant="solid"
                    size="sm"
                    onClick={() => openEditTagModal(tag)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 text-red-500"
                    onClick={() => openDeleteTagModal(tag)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between mt-4">
        <div>Previous</div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
        <div>Next</div>
      </div>

      {/* Add Tag Modal */}
      {isAddTagModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-[#7b625a] mb-4">Add New Tag</h2>
            <Input
              placeholder="Enter Tag Name"
              value={newTag.name}
              onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
              className="mb-4 border-[#7b625a] rounded px-3 py-2"
            />
            <Input
              placeholder="Enter Description"
              value={newTag.description}
              onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
              className="mb-4 border-[#7b625a] rounded px-3 py-2"
            />
            <Input
              placeholder="Enter Slug"
              value={newTag.slug}
              onChange={(e) => setNewTag({ ...newTag, slug: e.target.value })}
              className="mb-4 border-[#7b625a] rounded px-3 py-2"
            />
            <div className="flex justify-end space-x-4">
              <Button onClick={closeAddTagModal} className="bg-red-600 text-white rounded px-4 py-2">
                Cancel
              </Button>
              <Button onClick={handleAddTag} className="bg-[#4D413E] text-white rounded px-4 py-2">
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tag Modal */}
      {isEditTagModalOpen && selectedTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-[#7b625a] mb-4">Edit Tag</h2>
            <Input
              placeholder="Enter Tag Name"
              value={selectedTag.name}
              onChange={(e) => setSelectedTag({ ...selectedTag, name: e.target.value })}
              className="mb-4 border-[#7b625a] rounded px-3 py-2"
            />
            <Input
              placeholder="Enter Description"
              value={selectedTag.description}
              onChange={(e) => setSelectedTag({ ...selectedTag, description: e.target.value })}
              className="mb-4 border-[#7b625a] rounded px-3 py-2"
            />
            <Input
              placeholder="Enter Slug"
              value={selectedTag.slug}
              onChange={(e) => setSelectedTag({ ...selectedTag, slug: e.target.value })}
              className="mb-4 border-[#7b625a] rounded px-3 py-2"
            />
            <div className="flex justify-between space-x-4">
              <Button onClick={closeEditTagModal} className="bg-red-600 text-white rounded px-4 py-2">
                Cancel
              </Button>
              <Button onClick={handleEditTag} className="bg-[#4D413E] text-white rounded px-4 py-2">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Tag Confirmation Modal */}
      {isDeleteTagModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-[#7b625a] mb-4">Are you sure you want to delete?</h2>
            <p className="mb-6">Are you sure you want to delete this tag?</p>
            <div className="flex justify-between space-x-4">
              <Button onClick={closeDeleteTagModal} className="bg-gray-300 text-black rounded px-4 py-2">
                No, Cancel
              </Button>
              <Button onClick={handleDeleteTag} className="bg-[#4D413E] text-white rounded px-4 py-2">
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
