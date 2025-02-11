"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/auth-context";
import { useEffect, useState } from "react";
import { DataTable } from "../../../components/adminPage/optionsPages/dataTableHelpDesk";
import { useModel } from "@/hooks/model-context";
import { getAllQueryFromFireStore } from "@/lib/firebaseFunc";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function SellerHelpdeskPage(){
  const [query, setQuery] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [section, setSection] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");

  const { currentUser } = useAuth();
  const { isUpdated } = useModel();
  const [isChanged, setIsChanged] = useState(false);
  const onCLick = (e) => {
    if (section != e.value && e.value == "active") {
      setSection("active");
    } else if (section != e.value && e.value == "closed") {
      setSection("closed");
    } else if (section != e.value && e.value == "resolved") {
      setSection("resolved");
    } else if (section != e.value && e.value == "reopened") {
      setSection("reopened");
    }
  };

  const getQueries = async () => {
    const queries = await getAllQueryFromFireStore(section);
  
    const processedQueries = queries.map((query) => ({
      ...query,
      createdAt: query.createdAt
        ? new Date(query.createdAt.seconds * 1000 + query.createdAt.nanoseconds / 1e6)
        : null,
    }));
  
    if (processedQueries.length === 0) {
      setIsEmpty(true);
    }
  
    const timeOut = setTimeout(() => {
      setQuery(processedQueries);
    }, 150);
  
    return () => {
      clearTimeout(timeOut);
    };
  };  

  useEffect(() => {
    // if (currentUser) {
      getQueries();
    // }
    setIsChanged(false)
  }, [isUpdated, section, isChanged]);

  console.log(query)
  
  return (
    <div className=" flex justify-center w-full h-full relative">
      {isEmpty || query.length > 0 ? (
        <div className="w-full h-auto bg-white rounded-2xl p-4 ">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-6 text-[#4D413E]">Vendor Helpdesk</h1>
      </div>
      <div className="flex gap-2 my-4">
            <Button
              value="active"
              className={cn(
                "rounded-md text-white ",
                section === "active"
                  ? "bg-[#695d56]"
                  : "bg-white text-[#695d56]",
                "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={(e) => onCLick(e.target)}
            >
              Active
            </Button>
            <Button
              value="resolved"
              className={cn(
                "rounded-md text-white ",
                section === "resolved"
                  ? "bg-[#695d56]"
                  : "bg-white text-[#695d56]",
                "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={(e) => onCLick(e.target)}
            >
              Resolved
            </Button>
            <Button
              value="reopened"
              className={cn(
                "rounded-md text-white ",
                section === "reopened"
                  ? "bg-[#695d56]"
                  : "bg-white text-[#695d56]",
                "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={(e) => onCLick(e.target)}
            >
              Re-Opened
            </Button>
            <Button
              value="closed"
              className={cn(
                "rounded-md text-white ",
                section === "closed"
                  ? "bg-[#695d56]"
                  : "bg-white text-[#695d56]",
                "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={(e) => onCLick(e.target)}
            >
              Closed
            </Button>
          </div>

          {/* @ts-ignore */}
          <DataTable
            getQueries={getQueries}
            finalData={query}
            option={"query"}
            section={section}
            setSection={setSection}
            setIsChanged={setIsChanged}
          />
        </div>
      ) : (
        <div className="flex flex-col w-full h-[700px] relative bg-white rounded-2xl p-4 min-w-[615px]">
          <div className="text-3xl font-medium flex justify-center mb-4">
            Raised Queries
          </div>

          <div className="flex w-full justify-start">
            <Skeleton className="bg-gray-300 w-1/3" />
          </div>
          <div className="flex w-full justify-between mt-4 p-10">
            <Skeleton className="bg-gray-300 h-[300px] w-full" />
          </div>
        </div>
      )}
    </div>
  );
};


// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/users/uiTwo/table";
// import { Button } from "@/components/users/uiTwo/button";
// import {
//   DropdownMenu,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
// } from "@/components/ui/dropdown-menu";
// import { Pagination } from "@/components/ui/pagination";
// import { useState } from "react";
// import { FiChevronDown } from "react-icons/fi";
// import { MdOutlineRemoveRedEye } from "react-icons/md";

// export default function OrdersPage() {
//   const [selectedTab, setSelectedTab] = useState("Opened");
//   const [sortOption, setSortOption] = useState("Default");
//   const [filterOption, setFilterOption] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const ordersPerPage = 5;

//   const tabs = ["Opened", "Resolved", "Re-opened", "Closed"];

//   const orders = [
//     {
//       bookingId: "YGSBGFCNDB",
//       trackOrder: "YGSBGFCNDB",
//       bookingDate: "11-09-2024 18:00:00",
//       username: "YGSBGFCNDB",
//       phoneNumber: "+91 987567865",
//       email: "d@gmail.com",
//       category: "brand",
//     },
//     {
//       bookingId: "YGSBGFCNDB",
//       trackOrder: "YGSBGFCNDB",
//       bookingDate: "11-09-2024 18:00:00",
//       username: "YGSBGFCNDB",
//       phoneNumber: "+91 987567865",
//       email: "d@gmail.com",
//       category: "brand",
//     },
//     {
//       bookingId: "YGSBGFCNDB",
//       trackOrder: "YGSBGFCNDB",
//       bookingDate: "11-09-2024 18:00:00",
//       username: "YGSBGFCNDB",
//       phoneNumber: "+91 987567865",
//       email: "d@gmail.com",
//       category: "brand",
//     },
//     {
//       bookingId: "YGSBGFCNDB",
//       trackOrder: "YGSBGFCNDB",
//       bookingDate: "11-09-2024 18:00:00",
//       username: "YGSBGFCNDB",
//       phoneNumber: "+91 987567865",
//       email: "d@gmail.com",
//       category: "brand",
//     },
//   ];

//   // Calculate total pages based on the number of orders
//   const totalPages = Math.ceil(orders.length / ordersPerPage);

//   // Get the current page's orders
//   const currentOrders = orders.slice(
//     (currentPage - 1) * ordersPerPage,
//     currentPage * ordersPerPage
//   );

//   return (
//     <div className="p-6">
      

//       {/* Status Tabs */}
//       <div className="flex flex-wrap mb-6 overflow-x-auto">
//         {tabs.map((tab) => (
//           <Button
//             key={tab}
//             onClick={() => setSelectedTab(tab)}
//             className={`px-4 mt-5 me-4 py-2 ${
//               selectedTab === tab ? "bg-[#695d56] text-white" : ""
//             }`}
//             variant={selectedTab === tab ? "solid" : "outline"}
//           >
//             {tab}
//           </Button>
//         ))}
//       </div>

//       {/* Orders Table */}
//       <div className="bg-[#F3EAE7] p-6 rounded-lg shadow-md">
//         <Table className="border-none">
//           {" "}
//           {/* Removed border */}
//           <TableHeader>
//             <TableRow className="border-none font-bold">
//               <TableHead className="py-5 font-semibold text-[#2E2624]">
//                 User ID
//               </TableHead>
//               <TableHead className="py-5 font-semibold text-[#2E2624]">
//                 Name
//               </TableHead>
//               <TableHead className="py-5 font-semibold text-[#2E2624]">
//                 Email ID
//               </TableHead>
//               <TableHead className="py-5 font-semibold text-[#2E2624]">
//                 Category
//               </TableHead>
//               <TableHead className="py-5 font-semibold text-[#2E2624]">
//                 Action
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {currentOrders.map((order, index) => (
//               <TableRow key={index} className="border-none">
//                 <TableCell>{order.bookingId}</TableCell>
//                 <TableCell>{order.username}</TableCell>
//                 <TableCell>{order.email}</TableCell>
//                 <TableCell>{order.category}</TableCell>
//                 <TableCell className="flex items-center gap-3">
//                   <button
//                     variant="outline"
//                     size="sm"
//                     className="bg-[#F3EAE7] border-none"
//                   >
//                     <p className="text-[10px] bg-[#4D413E] px-3 text-white font-thin  border rounded-full border-[#4D413E]">
//                       Resolve
//                     </p>
//                   </button>
//                   <MdOutlineRemoveRedEye className="text-xl" />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-end mt-4">
//         <Pagination
//           totalPages={totalPages}
//           currentPage={currentPage}
//           onPageChange={(page) => setCurrentPage(page)}
//         />
//       </div>
//     </div>
//   );
// }
