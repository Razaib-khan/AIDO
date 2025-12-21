"use client";

import React, { useState } from "react";
import { Menu, X, Home, CheckCircle, Settings, LogOut } from "lucide-react";
import { Geist } from "next/font/google";

const geistSans = Geist({ subsets: ["latin"] });

const menuItems = [
  { icon: <Home size={24} />, label: "Dashboard" },
  { icon: <CheckCircle size={24} />, label: "Tasks" },
  { icon: <Settings size={24} />, label: "Settings" },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col justify-between bg-black shadow-lg transition-width duration-300 ${geistSans.className} ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Top Section: Toggle + Menu */}
      <div>
        {/* Toggle */}
        <div
          className={`flex items-center p-4 ${
            isOpen ? "justify-end" : "justify-center"
          }`}
        >
          {isOpen ? (
            <X
              size={28}
              className="text-green-400 hover:text-green-300 cursor-pointer transition-colors"
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <Menu
              size={28}
              className="text-green-400 hover:text-green-300 cursor-pointer transition-colors"
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>

        {/* Menu Items */}
        <ul className="mt-6 flex flex-col gap-2 px-2">
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-green-900 transition-all text-white ${
                !isOpen ? "justify-center" : ""
              }`}
            >
              {item.icon}
              {isOpen && <span className="text-lg font-medium">{item.label}</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-green-800 flex flex-col gap-4">
        <div
          className={`flex items-center gap-3 ${
            !isOpen ? "justify-center" : ""
          }`}
        >
          <img
            src="/profile.jpg" // replace with your avatar
            alt="Profile"
            className={`rounded-full object-cover ${isOpen ? "w-12 h-12" : "w-10 h-10"}`}
          />
          {isOpen && <span className="text-white font-medium text-lg">John Doe</span>}
        </div>
        <div
          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-green-900 text-white transition-colors ${
            !isOpen ? "justify-center" : ""
          }`}
        >
          <LogOut size={24} />
          {isOpen && <span className="font-medium text-lg">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
