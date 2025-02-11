"use client";

import { useEffect } from "react";
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
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";

export default function OrdersPage() {
  const [queries, setQueries] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Opened");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Default");
  const [filterOption, setFilterOption] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isWriteMessageModalOpen, setIsWriteMessageModalOpen] = useState(false);
  const [isClosingMessageModalOpen, setIsClosingMessageModalOpen] = useState(false);
  const [isConcluderModalOpen, setIsConcluderModalOpen] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const ordersPerPage = 5;
  const tabs = ["Opened", "Resolved", "Re-opened", "Closed"];

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await fetch('/api/queries');
      const data = await response.json();
      setQueries(data.queries);
    } catch (error) {
      console.error('Failed to fetch queries:', error);
    }
  };

  const handleStatusChange = async (queryId, newStatus) => {
    try {
      const response = await fetch('/api/queries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryId, status: newStatus }),
      });
      if (response.ok) {
        await fetchQueries();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const deleteQuery = async (queryId) => {
    try {
      const response = await fetch(`/api/queries?queryId=${queryId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchQueries();
      }
    } catch (error) {
      console.error('Failed to delete query:', error);
    }
  };

  const handleQuerySubmit = async () => {
    try {
      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID: `USER${Date.now()}`,
          username: "Test User",
          userEmail: "test@example.com",
          category: "General",
          status: "Opened"
        }),
      });
      if (response.ok) {
        await fetchQueries();
        closeQueryModal();
        openWriteMessageModal();
      }
    } catch (error) {
      console.error('Failed to submit query:', error);
    }
  };

  const currentQueries = queries.filter(query => query.status === selectedTab);
  const totalPages = Math.ceil(queries.length / ordersPerPage);

  const openQueryModal = (query) => {
    setCurrentQuery(query);
    setIsQueryModalOpen(true);
  };

  const closeQueryModal = () => {
    setIsQueryModalOpen(false);
    setCurrentQuery("");
  };

  const openWriteMessageModal = () => {
    setIsQueryModalOpen(false);
    setIsWriteMessageModalOpen(true);
  };

  const closeWriteMessageModal = () => {
    setIsWriteMessageModalOpen(false);
  };

  const openClosingMessageModal = () => {
    setIsWriteMessageModalOpen(false);
    setIsClosingMessageModalOpen(true);
  };

  const closeClosingMessageModal = () => {
    setIsClosingMessageModalOpen(false);
  };

  const openConcluderModal = () => {
    setIsClosingMessageModalOpen(false);
    setIsConcluderModalOpen(true);
  };

  const closeConcluderModal = () => {
    setIsConcluderModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-6">User Helpdesk</h1>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mr-4"
            />
            <Button variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582a9.977 9.977 0 00-2.614 6.319A10.014 10.014 0 1012 2.05V7h4"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => {
              setSelectedTab(tab);
              setCurrentPage(1); // Reset page on tab change
            }}
            className={`px-4 mt-5 me-4 py-2 ${
              selectedTab === tab ? "bg-[#695d56] text-white" : "text-[#695d56]"
            }`}
            variant={selectedTab === tab ? "solid" : "outline"}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="bg-[#F3EAE7] p-6 rounded-lg shadow-md">
        <Table className="border-none">
          <TableHeader>
            <TableRow className="border-none font-bold">
              <TableHead className="py-5 font-semibold text-[#2E2624]">
                User ID
              </TableHead>
              <TableHead className="py-5 font-semibold text-[#2E2624]">
                Name
              </TableHead>
              <TableHead className="py-5 font-semibold text-[#2E2624]">
                Email ID
              </TableHead>
              <TableHead className="py-5 font-semibold text-[#2E2624]">
                Category
              </TableHead>
              <TableHead className="py-5 font-semibold text-[#2E2624]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentQueries.map((query, index) => (
              <TableRow key={query.queryId} className="border-none">
                <TableCell>{query.userID}</TableCell>
                <TableCell>{query.username}</TableCell>
                <TableCell>{query.userEmail}</TableCell>
                <TableCell>{query.category}</TableCell>
                <TableCell className="flex items-center gap-3">
                  <button
                    variant="outline"
                    size="sm"
                    className="bg-[#F3EAE7] border-none"
                    onClick={() => handleStatusChange(query.queryId, "Resolved")}
                  >
                    <p className="text-[10px] bg-[#4D413E] px-3 text-white font-thin border rounded-full border-[#4D413E]">
                      {query.status === "Opened" ? "Resolve" : "View"}
                    </p>
                  </button>
                  <MdOutlineRemoveRedEye
                    className="text-xl cursor-pointer"
                    onClick={() => openQueryModal(query)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end mt-4">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Query Details Modal */}
      {isQueryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <h2 className="text-2xl font-bold mb-4 text-[#85716B]">Query Details</h2>
            <button className="absolute top-4 right-4" onClick={closeQueryModal}>
              <FiX className="text-xl" />
            </button>
            <label className="block mb-2 font-semibold text-lg text-[#4D413E]">Open Query</label>
            <Input
              value={currentQuery || ""}
              onChange={(e) => setCurrentQuery(e.target.value)}
              className="mb-4 w-full h-20 bg-[#C4B0A9] p-2 rounded"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleQuerySubmit}
                className="bg-[#4D413E] text-white px-4 py-2"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Write Message Modal */}
      {isWriteMessageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <h2 className="text-3xl font-bold mb-4 text-[#85716B]">Write Message</h2>
            <button className="absolute top-4 right-4" onClick={closeWriteMessageModal}>
              <FiX className="text-xl" />
            </button>
            <label className="block mb-2 font-semibold text-lg text-[#4D413E]">Subject</label>
            <Input value={submittedQuery || ""} readOnly className="mb-4 w-full" />
            <label className="block mb-2 font-semibold text-lg text-[#4D413E]">Message</label>
            <textarea
              placeholder="Write your response here..."
              className="w-full h-32 p-2 bg-[#C4B0A9] rounded"
            />
            <div className="flex justify-end mt-4">
              <Button
                onClick={openClosingMessageModal}
                className="bg-[#4D413E] text-white px-4 py-2"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Closing Message Modal */}
      {isClosingMessageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <h2 className="text-3xl font-bold mb-4 text-[#85716B]">Close Query</h2>
            <button className="absolute top-4 right-4" onClick={closeClosingMessageModal}>
              <FiX className="text-xl" />
            </button>
            <label className="block mb-2 font-semibold text-lg text-[#4D413E]">Subject</label>
            <Input value={submittedQuery || ""} readOnly className="mb-4 w-full" />
            <label className="block mb-2 font-semibold text-lg text-[#4D413E]">Message</label>
            <textarea
              placeholder="Add your closing remarks here..."
              className="w-full h-32 p-2 bg-[#C4B0A9] rounded"
            />
            <div className="flex justify-end mt-4">
              <Button
                onClick={openConcluderModal}
                className="bg-[#4D413E] text-white px-4 py-2"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Concluder Modal */}
      {isConcluderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <h2 className="text-3xl font-bold mb-4 text-[#85716B]">Query Summary</h2>
            <button className="absolute top-4 right-4" onClick={closeConcluderModal}>
              <FiX className="text-xl" />
            </button>
            <p className="text-lg font-semibold text-[#4D413E]">Query:</p>
            <p className="mb-4 p-2 bg-[#C4B0A9] rounded">{submittedQuery}</p>
            <p className="text-lg font-semibold text-[#4D413E]">Response:</p>
            <p className="p-2 bg-[#C4B0A9] rounded">Your detailed response here...</p>
            <div className="flex justify-end mt-4">
              <Button
                onClick={closeConcluderModal}
                className="bg-[#4D413E] text-white px-4 py-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
