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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { MdOutlineRemoveRedEye, MdRefresh } from "react-icons/md";
import Modal from "@/components/VendorModal";
import ServiceProviderDetails from "@/components/Vendor/ServiceProviderDetails";
import { ClipLoader } from "react-spinners";

export default function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState("Verified");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorStatus, setVendorStatus] = useState("Verified");
  const [detailsViewActive, setDetailsViewActive] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState("Available");
  const [loading, setLoading] = useState(false);
  const [filterOrders, setFilterOrders] = useState([]);
  const [orders, setOrders] = useState({
    Verified: [],
    Unverified: [],
    Disabled: []
  });
  
  const ordersPerPage = 10;

  const tabs = ["Verified", "Unverified", "Disabled"];
  const availiability = ["Available", "Unavailable"];

  const fetchVendors = async () => {
    try {
      const response = await fetch("/api/vendor/getServiceProviders");
      if (!response.ok) {
        throw new Error("Failed to fetch vendors");
      }
      const data = await response.json();

      const categorized = {
        Verified: data.filter((vendor) => vendor.isVerified === true),
        Unverified: data.filter((vendor) => vendor.isVerified === false),
        Disabled: data.filter((vendor) => vendor.isDisabled === true),
      };
      setOrders(categorized);
      setFilterOrders(categorized)
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!orders[selectedTab]) return;
    let vendors = orders[selectedTab];

    if (selectedAvailability) {
      vendors = vendors.filter((vendor) =>
        selectedAvailability === "Available" ? vendor.isAvailable : !vendor.isAvailable
      );
    }
    setFilterOrders((prevOrders) => ({ ...prevOrders, [selectedTab]: vendors }));
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedTab, selectedAvailability]);

  const filteredOrders = orders[selectedTab].filter((order) => {
    const name = order?.personalDetails?.name.toLowerCase();
    const userId = order?.id?.toString().toLowerCase();
    return (
      name.includes(searchQuery.toLowerCase()) ||
      userId.includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const openModal = (vendor) => {
    setSelectedVendor(vendor);
    setVendorStatus(selectedTab);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVendor(null);
  };


  const handleStatusChange = async (newStatus) => {
    if (!selectedVendor) return;
  
    const updatedDetails = {};
  
    if (newStatus === "Verified") {
      updatedDetails.isVerified = true;
      updatedDetails.isDisabled = false;
    } else if (newStatus === "Disabled") {
      updatedDetails.isDisabled = true;
      updatedDetails.isVerified = false;
    } else if (newStatus === "Unverified") {
      updatedDetails.isVerified = false;
      updatedDetails.isDisabled = false;
    }
  
    try {
      const response = await fetch("/api/vendor/updateVendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorId: selectedVendor.id,
          updatedDetails,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update");
      }
  
      const updatedVendor = await response.json();
  
      setOrders((prevOrders) => {
        const updatedOrders = { ...prevOrders };
  
        Object.keys(updatedOrders).forEach((key) => {
          updatedOrders[key] = updatedOrders[key].filter(
            (vendor) => vendor.id !== selectedVendor.id
          );
        });
  
        if (newStatus === "Verified") {
          updatedOrders.Verified.push({ ...selectedVendor, ...updatedDetails });
        } else if (newStatus === "Unverified") {
          updatedOrders.Unverified.push({ ...selectedVendor, ...updatedDetails });
        } else if (newStatus === "Disabled") {
          updatedOrders.Disabled.push({ ...selectedVendor, ...updatedDetails });
        }
  
        return updatedOrders;
      });
  
      closeModal();
    } catch (error) {
      console.error("Error updating vendor status:", error);
    }
  };


  const handleViewVendorDetails = (vendor) => {
    setSelectedVendor(vendor);
    setDetailsViewActive(true);
  };

  const handleBackToList = () => {
    setSelectedVendor(null);
    setDetailsViewActive(false);
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setCurrentPage(1);
    setLoading(true);
    setSelectedAvailability("Available");
    setFilterOrders([])
    fetchVendors();
  };

  return (
    <>
    {detailsViewActive ? (<ServiceProviderDetails selectedVendor={selectedVendor} handleBackToList={handleBackToList}/>) : (
      <div className="lg:px-6 md:px-4 lg:py-6 py-2 px-0">
        <div className="flex justify-between items-center mb-6 mt-4 md:mt-0 ">
          <h1 className="sm:text-4xl text-2xl font-bold mr-2 text-[#4D413E]">Service Providers</h1>
          <div className="flex items-center focus:outline-none">
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mr-4 focus:outline-none rounded-lg bg-[#F3EAE7] text-[#85716B]"
            />
            <button
              onClick={handleRefresh}
              className="border border-[#85716B] text-[#A1887F] px-2 py-2 text-xl rounded-xl flex items-center gap-2"
            >
            {
              loading ? <ClipLoader size={20} color="#85716B" loading={loading} /> : <MdRefresh />
            }
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap mb-6 sidebar-scrollbar overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 me-4 mb-2 py-2 ${selectedTab === tab ? "bg-[#695d56] text-white" : "text-[#695d56]"}`}
              variant={selectedTab === tab ? "solid" : "outline"}
            >
              {tab}
            </Button>
          ))}
          <div className="ms-auto">
            {availiability.map((tab) => (
              <Button
                key={tab}
                onClick={() => {
                  setSelectedAvailability(tab);
                  setCurrentPage(1);
                }}
                className={`px-4 me-4 mb-2 py-2 ${selectedAvailability === tab ? "bg-[#695d56] text-white" : "text-[#695d56]"}`}
                variant={selectedAvailability === tab ? "solid" : "outline"}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#F3EAE7] -z-50 rounded-lg shadow-md">
          <Table className="border-none -z-0">
            <TableHeader>
              <TableRow className="border-none font-bold text-[#2E2624]">
                <TableHead className="min-w-10"></TableHead>
                <TableHead className="py-3 font-semibold rounded-s-lg">Vendor ID</TableHead>
                <TableHead className="py-3 font-semibold text-nowrap">Vendor Name</TableHead>
                <TableHead className="py-3 font-semibold text-nowrap">Business Name</TableHead>
                <TableHead className="py-3 font-semibold text-nowrap">Phone Number</TableHead>
                <TableHead className="py-3 font-semibold text-nowrap">Email ID</TableHead>
                <TableHead className="py-3 font-semibold rounded-e-lg">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order, index) => {
                const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F3EAE7]";
                return (
                  <TableRow key={index} className={`my-1 shadow-sm border-none overflow-hidden rounded-xl bg-transparent`}>
                    <TableCell className={`px-3 py-1 rounded-s-xl ${bgColor}`}>
                      <img src={order?.documents?.photo} alt={`${order?.name}'s profile`} className="min-w-8 w-8 h-8 rounded-full mr-2" />
                    </TableCell>
                    <TableCell className={`px-1 py-1 ${bgColor}`}>{order?.id}</TableCell>
                    <TableCell className={`px-1 py-1 ${bgColor}`}>{order?.personalDetails?.name}</TableCell>
                    <TableCell className={`px-1 py-1 ${bgColor}`}>{order?.businessDetails?.businessName}</TableCell>
                    <TableCell className={`px-1 py-1 ${bgColor}`}>{order?.personalDetails?.phoneNumber}</TableCell>
                    <TableCell className={`px-1 py-1 ${bgColor}`}>{order?.personalDetails?.email}</TableCell>
                    <TableCell className={`px-3 py-2 rounded-e-xl flex items-center gap-2 ${bgColor}`}>
                      <button onClick={() => openModal(order)} className="bg-[#F3EAE7] text-nowrap border border-[#4D413E] text-xs px-2 py-1 rounded-full">
                        Change Status
                      </button>
                      <MdOutlineRemoveRedEye className="text-xl cursor-pointer" onClick={() => handleViewVendorDetails(order)} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredOrders.length}
            itemsPerPage={ordersPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
        <div className="flex justify-end mt-4">
          <PaginationPrevious onClick={(e) => { e.preventDefault(); handlePreviousPage(); }} />
          <PaginationLink onClick={(e) => { e.preventDefault(); handlePageClick(currentPage); }}>
            {currentPage}
          </PaginationLink>
          <PaginationNext onClick={(e) => { e.preventDefault(); handleNextPage(); }} />
        </div>     

        {/* Status Change Modal */}
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={closeModal} onConfirm={() => handleStatusChange(vendorStatus)} statusOptions={["Verified", "Unverified", "Disabled"]} selectedTab={vendorStatus} setSelectedTab={setVendorStatus}>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => handleStatusChange("Verified")}>Verify</Button>
              <Button onClick={() => handleStatusChange("Unverified")}>Unverify</Button>
              <Button onClick={() => handleStatusChange("Disabled")}>Disable</Button>
            </div>
          </Modal>
        )}
      </div>
      )
    }
    </>
  );
}