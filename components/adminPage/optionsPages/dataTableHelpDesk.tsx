"use client";

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
import {
  ArrowLeftIcon,
  ArrowRight,
  ArrowUpDown,
  ChevronLeftIcon,
  ChevronRightIcon,
  X,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  closeQuery,
  getQueryFromIdFromFireStore,
  getVendorFromVendorUIdFromFireStore,
  resolveQuery,
  updateQueriesFromFirestore,
} from "@/lib/firebaseFunc";
import { Textarea } from "@/components/ui/textarea";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import load from "../../../public/load.png";
import Image from "next/image";

export type Object = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  vendorId: string;
};

export function DataTable({
  getQueries,
  finalData,
  option,
  section,
  setSection,
  setIsChanged,
}: any) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState(finalData);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const [vendorName, setVendorName] = React.useState<string>("");
  const [vendorBuisness, setVendorBuisness] = React.useState("");
  const [selectedQueries, setSelectedQueries] = React.useState<any[]>([]);
  const [selectedQuery, setSelectedQuery] = React.useState<string>("");
  const [viewModal, setViewModal] = React.useState(false);
  const [sendModal, setSendModal] = React.useState(false);
  const [resolveMsg, setResolveMsg] = React.useState<string>("");
  const [closeMsg, setCloseMsg] = React.useState<string>("");
  const [item, setItem] = React.useState<any>();
  const [status, setStatus] = React.useState<any>("active");
  const getSellerDetails = async (id: string) => {
    const vendor = await getVendorFromVendorUIdFromFireStore(id);
    if (vendor) {
      setVendorName(vendor.ownerName);
      setVendorBuisness(vendor.buissnessName);
    } else {
      console.log("no seller found of these id");
    }
  };

  const columns: ColumnDef<Object>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
    table.getIsAllPageRowsSelected() 
      ? true 
      : table.getIsSomePageRowsSelected() 
      ? "indeterminate" 
      : false
  }

          //@ts-ignore
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            setTimeout(() => {
              if (value) {
                const dataF = table.getSelectedRowModel();
                dataF.rows.forEach((row) => {
                  //@ts-ignore
                  const idExist = selectedQueries.includes(row.original.id);
                  if (!idExist) {
                    //@ts-ignore
                    setSelectedQueries((curr) => [...curr, row.original.id]);
                    // selected.push(row.original.id);
                  }
                });
              } else {
                setSelectedQueries([]);
                // selected = [];
              }
            }, 0);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          //@ts-ignore
          onCheckedChange={(value) => {
            if (value) {
              //@ts-ignore
              setSelectedQueries((curr) => [...curr, row.original.id]);
              // selected.push(row.original.id);
            } else {
              let currProducts = selectedQueries;
              currProducts = selectedQueries.filter(
                //@ts-ignore
                (i) => i != row.original.id
              );
              setSelectedQueries(currProducts);
              // selected = selected.filter((i) => i != row.original.id);
            }

            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "queryId",
      header: "Query Id",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("queryId")}</div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const formatted = new Date(row.getValue("createdAt")).toLocaleString();
        return <div className="text-left font-medium ">{formatted}</div>;
      },
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

  React.useEffect(() => {
    table.setPageSize(5);
    setData(finalData);
    //@ts-ignore
    table.setRowSelection(false);
  }, [finalData]);


  const handleSendClick = async (queryId: string) => {
    try {
      const query = await getQueryFromIdFromFireStore(queryId);
      setSendModal(true);
      console.log(query);
      if (query) {
        setItem(query);
        setSelectedQuery(queryId);
        setSelectedQueries([queryId]);
        await getSellerDetails(query?.vendorUId);
      }
    } catch (error) {
      console.log("Error getting details for viewing a query");
    }
  };

  const handleViewClick = async (queryId: string) => {
    try {
      const query = await getQueryFromIdFromFireStore(queryId);
      setViewModal(true);
      console.log(query);
      if (query) {
        setItem(query);
        setSelectedQueries([queryId]);
        await getSellerDetails(query?.vendorUId);
      }
    } catch (error) {
      console.log("Error getting details for viewing a query");
    }
  };

  const handleResolve = async () => {
    try {
      setSendModal(false);
      await resolveQuery(selectedQuery, resolveMsg);
      console.log("Query resolved successfully");
      setSection("active");
    } catch (error) {
      console.error("Error resolving query:", error);
    }
  };

  const handleClose = async () => {
    try {
      setSendModal(false);
      await closeQuery(selectedQuery, closeMsg);
      console.log("Query closed successfully");
      setSection("active");
    } catch (error) {
      console.error("Error closing query:", error);
    }
  };
  
  return (
    <div>
      <div className="w-full h-full relative ">
        {viewModal && (
          <div
            className="fixed inset-0 z-[99] overflow-y-auto flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div
              className="bg-white p-6 rounded-xl shadow-xl w-2/4 max-h-4/5 overflow-y-auto"
              style={{ maxHeight: "80vh" }}
            >
              <div className="flex justify-end pb-0">
                <button
                  onClick={() => {
                    setViewModal(false);
                    setSelectedQueries([]);
                  }}
                  className="focus:outline-none"
                >
                  <X />
                </button>
              </div>
              <div className="flex justify-center items-center text-2xl font-semibold mb-4">
                Query Details
              </div>
              <div>
                <div className="flex flex-col">
                  <span className="m-2">Vendor ID</span>
                  <Input
                    readOnly
                    value={item.vendorUId}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="m-2">Query Title</span>
                  <Input readOnly value={item.title} className="rounded-xl" />
                </div>
                <div className="flex flex-col">
                  <span className="m-2">Query Description</span>
                  <Textarea
                    readOnly
                    value={item.description}
                    className="rounded-xl"
                  />
                </div>
              </div>
              {section === "active" ? (
                <></>
              ) : (
                <div className="flex flex-col">
                  <span className="m-2">Resolved Message</span>
                  <Textarea
                    readOnly
                    value={item.resolveMsg}
                    className="rounded-xl"
                  />
                </div>
              )}
              {section === "reopened" ||
              (section === "closed" && item.reopenMsg) ? (
                <div className="flex flex-col">
                  <span className="m-2">Re-Opened Message</span>
                  <Textarea
                    readOnly
                    value={item.reopenMsg}
                    className="rounded-xl"
                  />
                </div>
              ) : (
                <></>
              )}
              {section === "closed" ? (
                <div className="flex flex-col">
                  <span className="m-2">Closed Message</span>
                  <Textarea
                    readOnly
                    value={item.closeMsg}
                    className="rounded-xl"
                  />
                </div>
              ) : (
                <></>
              )}
              <div className="flex flex-row justify-end mt-10">
                <Button
                  type="submit"
                  className="mx-2 text-white"
                  onClick={() => {
                    setViewModal(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
        {sendModal && (
          <div
            className="fixed inset-0 z-[99] overflow-y-auto flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div
              className="bg-white p-6 rounded-xl shadow-xl w-2/4 max-h-4/5 overflow-y-auto"
              style={{ maxHeight: "80vh" }}
            >
              <div className="flex justify-end pb-0">
                <button
                  onClick={() => {
                    setSendModal(false);
                    setSelectedQueries([]);
                  }}
                  className="focus:outline-none"
                >
                  <X />
                </button>
              </div>
              {/* <div className="flex justify-center items-center text-2xl font-semibold mb-4">
                Query Details
              </div> */}
              <div>
                <div className="flex flex-col">
                  <span className="m-2">Subject</span>
                  {/* <Input
                    readOnly
                    value={item.queryId}
                    className="rounded-xl"
                  /> */}
                  <div className="rounded-xl border-solid border border-gray-400 p-4">
                    {item.queryId}:{" "}
                    {section === "active" ? "Issue Resolved" : "Issue Closed"}
                  </div>
                </div>

                {section === "active" ? (
                  <div className="flex flex-col">
                    <span className="m-2">Resolved Message</span>
                    <Textarea
                      value={resolveMsg}
                      onChange={(e) => setResolveMsg(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                ) : (
                  <></>
                )}

                {section === "resolved" || section === "reopened" ? (
                  <div className="flex flex-col">
                    <span className="m-2">Closed Message</span>
                    <Textarea
                      value={closeMsg}
                      onChange={(e) => setCloseMsg(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex flex-row justify-end mt-10">
                {section === "active" || section === "closed" ? (
                  <></>
                ) : (
                  <Button
                    type="submit"
                    className="mx-2 text-white"
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    Close
                  </Button>
                )}
                {section === "resolved" || section === "reopened" ? (
                  <></>
                ) : (
                  <Button
                    type="submit"
                    className="mx-2 text-white "
                    onClick={() => {
                      handleResolve();
                    }}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {data && (
          <>
            <div className="flex  pb-3 justify-between gap-2">
              <Input
                placeholder="Search with Title"
                value={
                  (table.getColumn("title")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <Image
                className=" cursor-pointer"
                onClick={getQueries}
                height={40}
                width={40}
                src={load}
                alt="load"
              />
            </div>
            <div className="rounded-md border ">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
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
                        className="h-9 m-0 p-0"
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="h-1  py-0">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                        <div className="flex gap-4 justify-center">
                          {section === "closed" ? (
                            <></>
                          ) : (
                            <Button
                              variant="outline"
                              className="rounded-full flex justify-center items-center my-2"
                              onClick={() => handleSendClick(row.original.id)}
                            >
                              {section === "active" ? "Resolve" : "Close"}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            className="rounded-full flex justify-center items-center my-2"
                            onClick={() => handleViewClick(row.original.id)}
                          >
                            View
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

            <div className="flex items-center justify-end px-2 mt-3">
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to first page</span>
                    <ArrowLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to last page</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
