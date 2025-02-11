"use client";

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
import { useEffect, useState } from "react";
import { MdRefresh } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";

const BlogEditor = dynamic(() => import("@/components/BlogEditorForm"), { 
  ssr: false,
  loading: () => <div className="flex justify-center p-8"><ClipLoader /></div>
});

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [detailsViewActive, setDetailsViewActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);

  const blogsPerPage = 10;

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blogs");
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const { data } = await response.json();
      setBlogs(data);
    } catch (error) {
      toast.error("Error fetching blogs");
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const searchString = searchQuery.toLowerCase();
    return (
      blog?.title?.toLowerCase().includes(searchString) ||
      blog?.description?.toLowerCase().includes(searchString) ||
      blog?.category?.toLowerCase().includes(searchString)
    );
  });

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleRefresh = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchBlogs();
  };

  return (
    <>
      {detailsViewActive ? (
        <BlogEditor
          selectedBlog={selectedBlog}
          handleBackToList={() => {
            setDetailsViewActive(false);
            setSelectedBlog(null);
            fetchBlogs();
          }}
        />
      ) : (
        <div className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#4D413E]">Blogs</h1>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setDetailsViewActive(true)}
                className="bg-[#695d56] text-white hover:bg-[#4D413E]"
              >
                Add Blog
              </Button>
              <Input
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-[200px] bg-[#F3EAE7]"
              />
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg border border-[#85716B] text-[#85716B] hover:bg-[#F3EAE7]"
                disabled={loading}
              >
                {loading ? <ClipLoader size={20} color="#85716B" /> : <MdRefresh size={20} />}
              </button>
            </div>
          </div>

          <div className="bg-[#F3EAE7] rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#695d56]">
                  <TableHead className="text-white">Title</TableHead>
                  <TableHead className="text-white">Description</TableHead>
                  <TableHead className="text-white">Category</TableHead>
                  <TableHead className="text-white">Tags</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBlogs.length > 0 ? (
                  paginatedBlogs.map((blog, index) => (
                    <TableRow
                      key={blog._id}
                      className={`cursor-pointer hover:bg-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-[#F3EAE7]"
                      }`}
                      onClick={() => {
                        setSelectedBlog(blog);
                        setDetailsViewActive(true);
                      }}
                    >
                      <TableCell>{blog.title}</TableCell>
                      <TableCell>{blog.description}</TableCell>
                      <TableCell>{blog.category}</TableCell>
                      <TableCell>
                        {blog.tags?.length > 0 
                          ? blog.tags.slice(0, 3).join(", ") 
                          : "No Tags"}
                      </TableCell>
                      <TableCell>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      {loading ? "Loading..." : "No blogs found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-end mt-4">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredBlogs.length}
                itemsPerPage={blogsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
