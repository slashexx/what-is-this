"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/users/uiTwo/table";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { FiChevronDown } from "react-icons/fi";
import { useAuth } from "@/hooks/auth-context";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { IoMdRefresh } from "react-icons/io";

const CouponsPage = () => {

  const [activeTab, setActiveTab] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialogue, setOpenDialogue] = useState(false);
  const [couponTitle, setCouponTitle] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [discount, setDiscount] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  const tabs = ["Active", "Inactive"];

  // useEffect(()=>{
  //   const filteredCoupons = coupons.filter(coupon => coupon.status === activeTab);
  // },[activeTab])

  const fetchCoupons = async () => {
    if (currentUser?.userID) {
      try {
        setRefresh(true);
        const response = await fetch('/api/coupons/getCoupons');
        const result = await response.json();
        if (result.coupons) {
          setCoupons(result.coupons);
          setFilteredCoupons(result.coupons.filter(coupon => coupon.status === activeTab));
        } else {
          toast.error('Failed to fetch coupons');
        }
      } catch (error) {
        toast.error('Error fetching coupons');
      } finally {
        setRefresh(false);
      }
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [currentUser, activeTab]);

  useEffect(() => {
    if (coupons.length > 0) {
      const filtered = coupons.filter(coupon => {
        const matchesStatus = coupon.status === activeTab;
        const matchesSearch = searchQuery.toLowerCase() === '' || 
          coupon.couponTitle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      });
      setFilteredCoupons(filtered);
    }
  }, [activeTab, coupons, searchQuery]);

  const handleAddCoupon = async () => {
    if (!isValidCouponTitle(couponTitle)) {
      setError("Coupon name must have 4 uppercase letters and 2 digits.");
      return;
    }
    setError("");       
    setLoading(true);
    try {
      const response = await fetch('/api/coupons/addCoupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponTitle,
          discount: parseInt(discount),
          minPrice: parseInt(minPrice),
          vendorId: currentUser?.id,
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success("Coupon added successfully!");
        setCouponTitle("");
        setDiscount("");
        setMinPrice("");
        fetchCoupons();
        setOpenDialogue(false);
      } else {
        toast.error(result.error || "Failed to add coupon");
      }
    } catch (error) {
      toast.error("Error adding coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDisable = async (couponID, status) => {
    try {
      setLoading(true);
      const response = await fetch('/api/coupons/updateCoupon', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponID,
          updatedFields: { status: status === "Active" ? 'Inactive': "Active" },
        }),
      });
  
      const result = await response.json();
      if (result.success) {
        toast.success('Coupon status updated');
        fetchCoupons();
      } else {
        toast.error(result.error || 'Failed to update coupon');
      }
    } catch (error) {
      toast.error('Failed to update coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (couponID) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        setLoading(true);
        const response = await fetch('/api/coupons/deleteCoupon', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ couponID }),
        });

        const result = await response.json();
        if (result.success) {
          toast.success('Coupon deleted successfully');
          fetchCoupons();
        } else {
          toast.error(result.error || 'Failed to delete coupon');
        }
      } catch (error) {
        toast.error('Error deleting coupon');
      } finally {
        setLoading(false);
      }
    }
  };

  const isValidCouponTitle = (title) => /^[A-Z]{4}\d{2}$/.test(title);
  
  return (
    <div className="min-h-screen py-6">
      <div className="flex justify-between mb-3">
        <h1 className="text-4xl font-bold mb-6">Coupons</h1>

        {/* Top Controls: Add, Sort, Filter, Search */}
        <div className="flex justify-between items-center mb-4">
          {/* Add Coupon */}
          <Dialog onOpenChange={setOpenDialogue} open={openDialogue}>
            <DialogTrigger asChild>
              <Button className="rounded-md text-sm bg-[#695d56] text-white mr-3">
                Add Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle>Add a Coupon</DialogTitle>
                <DialogDescription>
                  Enter details for the new coupon.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-center gap-2">
                  <Label htmlFor="couponTitle" className="flex justify-start w-full ml-1">
                  Coupon Name
                  </Label>
                  <Input
                    id="couponTitle"
                    placeholder="Coupon Name"
                    value={couponTitle}
                    onChange={(e) => setCouponTitle(e.target.value)}
                    className="bg-zinc-100"
                  />
                  {error && <span className="text-red-500 text-start w-full text-[10px]">{error}</span>}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Label htmlFor="discount" className="flex w-full justify-start">
                  Percentage Discount
                  </Label>
                  <Input
                    id="discount"
                    placeholder="e.g., 20%"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="bg-zinc-100"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Label htmlFor="minPrice" className="flex w-full justify-start">
                    Minimum Price
                  </Label>
                  <Input
                    id="minPrice"
                    placeholder="e.g., Rs. 500"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="bg-zinc-100"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2 flex flex-col">
                <Button
                  disabled={!couponTitle || !discount || !minPrice}
                  className="bg-baw-baw-g3 text-white"
                  onClick={handleAddCoupon}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Coupon"}
                </Button>
                <Button variant="outline" onClick={() => setOpenDialogue(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mr-4 flex items-center">
                Sort
                <FiChevronDown className="ml-2" /> {/* Arrow Icon */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuItem onSelect={() => setSortOption("Ascending")}>
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortOption("Descending")}>
                Descending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mr-4 flex items-center">
                Filter
                <FiChevronDown className="ml-2" /> {/* Arrow Icon */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuItem onSelect={() => setFilterOption("All")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterOption("Completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterOption("Pending")}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Input */}
          <div className="flex items-center">
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mr-4"
            />
            <Button variant="outline" onClick={fetchCoupons}>
              {refresh ? (
                  <ClipLoader size={17} color={"#000"} loading={refresh} />
              ) : (
                  <IoMdRefresh className="text-xl" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tab buttons */}
      <div className="flex flex-wrap mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 me-4 py-2 ${
              activeTab === tab ? "bg-[#695d56] text-white" : "text-[#695d56]"
            }`}
            variant={activeTab === tab ? "solid" : "outline"}
          >
            {tab}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="items-center justify-center flex py-2 h-[50vh] w-full rounded z-10">
          <ClipLoader
            color={"#000"}
            loading={loading}
            size={24}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
         </div>
         ) : (
          <div className="bg-[#F3EAE7] p-6 rounded-lg shadow-md">
            <Table className="w-full border-none">
              <TableHeader>
                <TableRow className="border-none font-bold">
                  <TableHead className="py-5 font-semibold text-[#2E2624]">
                    Coupon ID
                  </TableHead>
                  <TableHead className="py-5 font-semibold text-[#2E2624]">
                    Coupon Name
                  </TableHead>
                  <TableHead className="py-5 font-semibold text-[#2E2624]">
                    Percentage Discount
                  </TableHead>
                  <TableHead className="py-5 font-semibold text-[#2E2624]">
                    Min. Price
                  </TableHead>
                  <TableHead className="py-5 font-semibold text-[#2E2624]">
                    Number of times used
                  </TableHead>
                  <TableHead className="py-5 font-semibold text-[#2E2624]">
                    Created at
                  </TableHead>
                  <TableHead className="py-5 font-semibold text-[#2E2624]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {filteredCoupons.map((coupon, index) => (
                  <tr key={index} className="border-none">
                    
                    <td className="p-2">{coupon.id}</td>
                    <td className="p-2">{coupon.couponTitle}</td>
                    <td className="p-2">{coupon.discount}</td>
                    <td className="p-2">{coupon.minPrice}</td>
                    <td className="p-2">{coupon.timesUsed}</td>
                    <td className="p-2">
                        {(() => {
                          const { createdAt } = coupon;
                          
                          if (createdAt?.seconds && createdAt?.nanoseconds) {
                            return new Date(
                              createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
                            ).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit'
                            });
                          }
                          
                          if (typeof createdAt === "string") {
                            return new Date(createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit'
                            });
                          }
                          
                          return "Invalid Date";
                        })()}
                    </td>

                    <td className="p-2">
                      <div>
                          <button
                            onClick={() => handleToggleDisable(coupon.id, coupon.status)}
                            className="bg-red-500 text-white py-1 px-2 rounded"
                          >
                            {coupon.status === "Active" ? "Disable" : "Active"}
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="bg-red-500 text-white py-1 px-2 rounded"
                          >
                            Delete
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {
                  filteredCoupons.length < 1 && !loading && (
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <h3 className="text-start py-5">No Data</h3>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                  ) 
                }
              </tbody>
            </Table>
      </div>)}

      {/* Pagination */}
      {/* <div className="mt-4 flex justify-end space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`p-2 border rounded ${
              currentPage === index + 1
                ? "bg-gray-900 text-white"
                : "bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div> */}
    </div>
  );
}

export default CouponsPage
