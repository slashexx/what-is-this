'use client';

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/users/uiTwo/table";
import { Button } from "@/components/users/uiTwo/button";
import { Badge } from "@/components/users/uiTwo/badge";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Circles } from "react-loader-spinner";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = date.getHours() >= 12 ? 'PM' : 'AM';
  return `${year}-${month}-${day} (${hours}:${minutes}${period})`;
};

export function UsersTable({ searchTerm }) {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data.users);
        setAllUsers(data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setUsers(allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      setCurrentPage(1);
    } else {
      setUsers(allUsers);
    }
  }, [searchTerm, allUsers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Circles height={50} width={50} color="#d5a6a6" />
      </div>
    );
  }

  const handleClick = (userId) => {
    router.push(`/users/users-details?userId=${userId}`);
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const confirmBlock = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id ? { ...user, status: "Blocked" } : user
      )
    );
    closeModal();
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
          <div className="text-sm text-gray-500">
            Total Users: {users.length}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-600">Index</TableHead>
                <TableHead className="font-semibold text-gray-600">User Name</TableHead>
                <TableHead className="font-semibold text-gray-600">Email ID</TableHead>
                <TableHead className="font-semibold text-gray-600">Joined Date</TableHead>
                <TableHead className="font-semibold text-gray-600">Last Activity</TableHead>
                <TableHead className="font-semibold text-gray-600">Subscription</TableHead>
                <TableHead className="font-semibold text-gray-600">Status</TableHead>
                <TableHead className="font-semibold text-gray-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow 
                  key={user.userId}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <TableCell className="font-medium">{user.index}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>{formatDate(user.updatedAt)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                      {user.subscription}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        user.status === "Active"
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}
                    >
                      {user.status || "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                        onClick={() => handleClick(user.userId)}
                      >
                        Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                        onClick={() => openModal(user)}
                      >
                        Block
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-gray-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                variant={currentPage === index + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? "bg-gray-900 text-white" : "text-gray-600"}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-gray-600"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Block User Modal */}
      <Dialog 
        open={isModalOpen} 
        onClose={closeModal}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <AlertCircle className="h-6 w-6" />
              <Dialog.Title className="text-lg font-semibold">
                Confirm User Block
              </Dialog.Title>
            </div>

            <Dialog.Description className="text-gray-600 mt-2">
              Are you sure you want to block the user <span className="font-semibold">{selectedUser?.name}</span>? 
              This action can be reversed later.
            </Dialog.Description>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={closeModal}
                className="text-gray-600"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmBlock}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Block User
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </Card>
  );
}