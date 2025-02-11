"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import load from "../../../public/load.png";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAuth } from "@/hooks/auth-context";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ArrowUpDown, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getAllUsersFromFireStore } from "@/lib/userFirebaseFunc";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
//@ts-ignore
export type Query = {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  userID: string;
  password: string;
  name: string;
};

export default function TeamPage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [isQueryAdded, setIsQueryAdded] = useState(false);
  const [data, setData] = useState<any>([]);
  const [openDialogue, setOpenDialogue] = useState<boolean>(false);
  const [deleteDialogue, setDeleteDialogue] = useState<boolean>(false);
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [search, setSearch] = useState("userID");
  const [slugToAdd, setSlugToAdd] = useState<string>("");
  const [descToAdd, setDescToAdd] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [uid1, setUid1] = useState<string>("");
  const [status] = useState("Active");

  useEffect(() => {
    table.setPageSize(5);
  }, []);

  useEffect(() => {
    if (!openDialogue) {
      setRole("");
      setPassword("");
      setCPassword("");
      setName("");
      setEmail("");
      setDescToAdd("");
      setIsEdit(false);
    }
  }, [openDialogue]);

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Valid email is required");
      return false;
    }
    if (!isEdit && !password) {
      toast.error("Password is required for new team members");
      return false;
    }
    if (!role) {
      toast.error("Role is required");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setRole("");
    setName("");
    setDescToAdd("");
    setSlugToAdd("");
    setIsEdit(false);
    setOpenDialogue(false);
    setIsQueryAdded(false);
  };

  const getQueries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/team');
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setData(result);
    } catch (error) {
      console.error("Error fetching team:", error);
      toast.error("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  const searchTitles = [
    "userID",
    "email",
    "role",
  ]

  useEffect(() => {
    getQueries();
  }, [changed]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [currReOpenQuey, setCurrReOpenQuey] = useState<string>("");

  useEffect(() => {
    setSlugToAdd(name.toLowerCase().split(" ").join("-"));
  }, [name]);

  const columns: ColumnDef<Query>[] = [
    {
      accessorKey: "userID",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const formatted = row.getValue("userID") as string;
        return <div className="text-left font-medium ">{formatted}</div>;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const formatted = row.getValue("email") as string;
        return <div className="text-left font-medium ">{formatted}</div>;
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
  ];
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  interface sendMail {
    email: string;
    name: string;
    message: string;
    subject: string;
  }
  const sendEmail = async ({ email, name, subject, message }: sendMail) => {
    try {
      const response = await fetch("/api/zeptomail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, subject, message }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleCreateUser = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          status: 'Active' // Always set to Active
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      toast.success("Team member created successfully");
      setChanged(prev => !prev);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create team member");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/team', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: uid1 }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      toast.success("Team member deleted successfully");
      setDeleteDialogue(false);
      setChanged(prev => !prev);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete team member");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID: uid1,
          name,
          role,
          status,
          ...(role === "author" && { 
            slug: slugToAdd,
            description: descToAdd 
          })
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      toast.success("Team member updated successfully");
      setChanged(prev => !prev);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to update team member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-[615px] w-full flex flex-col p-4 bg-white rounded-2xl ">
        <h2 className="text-3xl w-full flex font-medium justify-center items-center ">
          Team
        </h2>

        <div className="w-full h-auto mt-3 relative">
          <div className="w-full  flex flex-col justify-center items-center gap-2 ">
            <div>
              <Dialog
                onOpenChange={setOpenDialogue}
                open={openDialogue}
                modal={true}
              >
                <DialogTrigger asChild>
                  <Button className="absolute -top-[3.2rem] right-0 rounded-xl text-sm">
                    Create User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
                    <DialogDescription>
                      {isEdit ? "Update team member details" : "Create a new team member"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={isEdit ? handleEditUser : handleCreateUser} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                      />
                    </div>

                    {!isEdit && (
                      <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          required
                        />
                      </div>
                    )}

                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Enter role (Admin or Team Member)"
                        required
                      />
                    </div>

                    {role === "author" && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="slug">Slug</Label>
                          <Input
                            id="slug"
                            value={slugToAdd}
                            onChange={(e) => setSlugToAdd(e.target.value)}
                            placeholder="Enter slug"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            value={descToAdd}
                            onChange={(e) => setDescToAdd(e.target.value)}
                            placeholder="Enter description"
                            required
                          />
                        </div>
                      </>
                    )}

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isEdit ? (
                          "Save Changes"
                        ) : (
                          "Add Member"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div>
              <Dialog
                onOpenChange={setDeleteDialogue}
                open={deleteDialogue}
                modal={true}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                      Are you sure, you want to delete this user?
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={async (event) => {
                        setLoading(true);
                        await handleDeleteUser(event);
                        setLoading(false);
                        setDeleteDialogue(false);
                        toast.success("Successfully deleted the User");
                      }}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Delete User"
                      )}
                    </Button>

                    <Button
                      onClick={() => {
                        setDeleteDialogue(false);
                      }}
                      variant="outline"
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className=" flex flex-col w-full h-full relative">
                <div className="flex w-full justify-between">
                  <Skeleton className="bg-gray-300 h-8 w-[350px] rounded-xl" />

                  <Skeleton className="bg-gray-300 h-8 w-[130px] rounded-xl" />
                </div>
                <div className="flex w-full justify-between mt-4">
                  <Skeleton className="bg-gray-300 h-[300px] w-full" />
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="flex items-center py-1 w-full gap-4">
                  <div className="w-full">
                    <Input
                      placeholder="Search by search type..."
                      value={
                        (table.getColumn(search)?.getFilterValue() as string) ??
                        ""
                      }
                      onChange={(event) =>
                        table
                          .getColumn(search)
                          ?.setFilterValue(event.target.value)
                      }
                      className="max-w-sm mb-2"
                    />
                  </div>
                  {/* <Select
                    onValueChange={(e) => {
                      console.log(e);
                      setSearch(e);
                    }}
                  >
                    <SelectTrigger className="bg-zinc-100 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none w-1/4">
                      <SelectValue placeholder="Select a search type" />
                    </SelectTrigger>

                    <SelectContent>
                      {searchTitles.map((mt: any) => (
                        <SelectItem key={mt} value={mt} className="capitalize">
                          {mt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto">
                        Columns <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <Image
                        className=" cursor-pointer"
                        onClick={getQueries}
                        height={40}
                        width={40}
                        src={load}
                        alt="load"
                      />
                    <DropdownMenuContent align="end">
                      
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value: any) =>
                                column.toggleVisibility(!!value)
                              }
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="h-9 m-0 p-0">
                          {headerGroup.headers.map((header) => {
                            return (
                              <TableHead key={header.id}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id} className="h-2 py-3">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                            <div className="flex gap-4 justify-center">
                              <Button
                                variant="outline"
                                className="rounded-full flex justify-center items-center my-2"
                                onClick={() => {
                                  setOpenDialogue(true);
                                  setName(row.original.name);
                                  setEmail(row.original.email);
                                  setRole(row.original.role);
                                  setUid1(row.original.userID);
                                  setIsEdit(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                className="rounded-full flex justify-center items-center my-2"
                                onClick={() => {
                                  setDeleteDialogue(true);
                                  setUid1(row.original.userID);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
