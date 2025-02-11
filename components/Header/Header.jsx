"use client";
import { MyContext } from "../../context/MyContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useState, useEffect } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa"; // Added FaUserCircle

import logo from "../../public/juristo.png";
import Noti from "../../public/Notification.png";
import profile from "../../public/profile.png";
import darrow from "../../public/darrow.png";

const Header = () => {
  const router = useRouter();
  const { isOpen, setIsOpen } = useContext(MyContext);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setUserName(user.name || 'User');
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar open/close
  };

  return (
    <div className="md:min-h-[4rem] sm:min-h-[5rem] min-h-[3rem] w-full fixed flex md:flex-row justify-between items-center py-2 md:py-1 md:px-12 px-2 flex-col-reverse bg-white border-b-2 border-baw-baw-g5">
      
      {/* Logo and Menu (FaBars) - Responsive */}
      <div className="flex justify-between items-center w-full lg:w-auto">
        <button
          className="lg:hidden bg-baw-baw-g4 p-2 rounded-full text-white"
          onClick={toggleSidebar}
        >
          { isOpen ?
            <FaTimes className="h-6 w-6" /> :
            <FaBars className="h-6 w-6" />
          }
          
        </button>
        <Image src={logo} height={30} width={30} alt="Logo" className="sm:w-12 w-10"/>  JURISTO
      </div>

      {/* Profile and Notifications (Visible on large screens only) */}
      <div className="flex justify-end lg:flex-1">
        <div className="lg:flex gap-5 items-center hidden">
          <Image src={Noti} width={20} height={20} alt="Notification" />
          <div className="flex gap-2 items-center">
            <FaUserCircle className="text-2xl text-gray-600" />
            <h1 className="font-semibold">{userName}</h1>
            <Image
              src={darrow}
              height={20}
              width={20}
              className="cursor-pointer"
              alt="Dropdown Arrow"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
