"use client";
import React, { useContext } from "react";
import {
  FaHome,
  FaUsers,
  FaShoppingCart,
  FaTicketAlt,
  FaQuestionCircle,
  FaFileAlt,
  FaTags,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaRegHandPointRight,
} from "react-icons/fa";
import { MyContext } from "@/context/MyContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth-context";

const Sidebar = () => {
  const { isOpen, setIsOpen } = useContext(MyContext);
  const { logout } = useAuth();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative mt-20">
      {/* Sidebar */}
      <div
        className={`w-64 shadow-lg z-50 bg-white fixed left-0 transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:block`}
        style={{ height: "calc(100vh - 80px)" }}
      >
        <div className="p-4 sidebar-scrollbar max-h-full overflow-y-auto flex flex-col">
          <div className="mb-6">
            <div className="space-y-1 mb-12">
              <SidebarLink Icon={FaHome} label="Dashboard" href="/dashboard" />
              <SidebarLink Icon={FaUsers} label="Vendors" href="/vendors" />
              <SidebarLink
                Icon={FaUsers}
                label="Service Providers"
                href="/service-providers"
              />
              <SidebarLink Icon={FaUsers} label="Users" href="/users" />
              <SidebarLink
                Icon={FaShoppingCart}
                label="Orders"
                href="/orders"
              />
              <SidebarLink
                Icon={FaTicketAlt}
                label="Bookings"
                href="/bookings"
              />
              <SidebarLink
                Icon={FaTicketAlt}
                label="Products"
                href="/products"
              />
            </div>
          </div>

          {/* Help Desk */}
          <div className="mb-6">
            <div className="bg-baw-baw-g4 text-white px-3 py-2 rounded-md font-semibold baw-text">
              Help Desk
            </div>
            <div className="space-y-2 mt-4 mb-12">
              <SidebarLink
                Icon={FaQuestionCircle}
                label="User Helpdesk"
                href="/user-helpdesk"
              />
              <SidebarLink
                Icon={FaQuestionCircle}
                label="Vendor Help desk"
                href="/vendor-helpdesk"
              />
              <SidebarLink Icon={FaFileAlt} label="Contact" href="/contact" />
            </div>
          </div>

          {/* Admin */}
          <div className="mb-6">
            <div className="bg-baw-baw-g4 text-white px-3 py-2 rounded-md font-semibold baw-text">
              Admin
            </div>
            <div className="space-y-2 mt-4">
              <SidebarLink Icon={FaTags} label="Coupons" href="/coupons" />
              <SidebarLink Icon={FaUsers} label="Team" href="/team" />
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="bg-baw-baw-g4 text-white px-3 py-2 rounded-md font-semibold baw-text">
              Content
            </div>
            <div className="space-y-2 mt-4">
              <SidebarLink Icon={FaFileAlt} label="Blogs" href="/blogs" />
              <SidebarLink Icon={FaFileAlt} label="Graphics" href="/graphics" />
              <SidebarLink
                Icon={FaFileAlt}
                label="Categories"
                href="/categories"
              />
              <SidebarLink Icon={FaTags} label="Tags" href="/tags" />
              <SidebarLink Icon={FaFileAlt} label="Media" href="/media" />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4">
          <SidebarLink Icon={FaRegHandPointRight} label="Reports" href="/reports" />
          
            <SidebarLink Icon={FaCog} label="Settings" href="/settings" />
            <SidebarLink Icon={FaSignOutAlt} label="Logout" href="/logout" />
          </div>
        </div>
      </div>

      {/* Overlay for mobile view to close the sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

const SidebarLink = ({ Icon, label, href }) => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleClick = () => {
    if (href === '/logout') {
      logout();
    } else {
      router.push(href);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center space-x-2 baw-text hover:bg-baw-baw-g6 px-2 py-2 rounded-md cursor-pointer"
    >
      <Icon className="h-5 w-5 text-baw-text" />
      <span className="text-baw-text">{label}</span>
    </div>
  );
};

export default Sidebar;
