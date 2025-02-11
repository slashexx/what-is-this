"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { getAllUsersFromFireStore } from "@/lib/userFirebaseFunc";
import { Skeleton } from "@/components/ui/skeleton";
import load from "../../../public/load.png";
import Image from "next/image";

export function UserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewUser, setViewUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getUsers = async () => {
    setLoading(true);
    try {
      const usersData = await getAllUsersFromFireStore();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (user: any) => {
    setViewUser(user);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-[615px] w-full flex flex-col p-4 bg-white rounded-2xl">
      <h2 className="text-3xl w-full flex font-medium justify-center items-center mb-6">
        Users
      </h2>

      {loading ? (
        <div className="flex flex-col w-full h-full relative">
          <div className="flex w-full justify-between">
            <Skeleton className="bg-gray-300 h-8 w-[350px] rounded-xl" />
            <Skeleton className="bg-gray-300 h-8 w-[130px] rounded-xl" />
          </div>
          <div className="flex w-full justify-between mt-4">
            <Skeleton className="bg-gray-300 h-[300px] w-full" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <Input
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Image
              className="cursor-pointer"
              onClick={getUsers}
              height={40}
              width={40}
              src={load}
              alt="load"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Creation Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.displayName || "N/A"}</TableCell>
                    <TableCell>
                      {user.createdAt?.toDate().toLocaleDateString() || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => handleViewDetails(user)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
              </DialogHeader>
              {viewUser && (
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Email:</p>
                    <p>{viewUser.email}</p>
                  </div>
                  <div>
                    <p className="font-medium">Name:</p>
                    <p>{viewUser.displayName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Created At:</p>
                    <p>
                      {viewUser.createdAt?.toDate().toLocaleDateString() || "N/A"}
                    </p>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
