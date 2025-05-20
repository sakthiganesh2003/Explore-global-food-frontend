"use client";

import { useState } from "react";
import { Home, Utensils, BookOpen, CreditCard, Menu, ChefHat } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`min-h-screen bg-gray-900 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
      {/* Toggle Button */}
      <button
        className="p-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-4 mt-4 px-2">
        <SidebarItem icon={<Home />} text="Home" href="/Admin" isOpen={isOpen} />
        <SidebarItem icon={<Utensils />} text="Maid From" href="/Admin/Booking" isOpen={isOpen} />
        
        <SidebarItem icon={<ChefHat />} text="Maid Status" href="/Admin/maidstatus" isOpen={isOpen} />
        <SidebarItem icon={<ChefHat />} text="chef form" href="/Admin/chef" isOpen={isOpen} />
        <SidebarItem icon={<ChefHat />} text="orders" href="/Admin/orders" isOpen={isOpen} />
        <SidebarItem icon={<ChefHat />} text="refunds" href="/Admin/refund" isOpen={isOpen} />
        <SidebarItem icon={<ChefHat />} text="Users" href="/Admin/users" isOpen={isOpen} />
        <SidebarItem icon={<ChefHat />} text="chefposts" href="/Admin/chefposts" isOpen={isOpen} />
        <SidebarItem icon={<ChefHat />} text="payment history" href="/Admin/paymenthistory" isOpen={isOpen} />
        <SidebarItem icon={<ChefHat />} text="maid earnings" href="/Admin/maidearnings" isOpen={isOpen} />
        <SidebarItem icon={<ChefHat />} text="feedback" href="/Admin/feedback" isOpen={isOpen} />
     
      </nav>
    </div>
  );
};

// Sidebar Item Component
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  href: string;
  isOpen: boolean;
}

const SidebarItem = ({ icon, text, href, isOpen }: SidebarItemProps) => {
  return (
    <Link href={href} className="flex items-center p-3 hover:bg-gray-700 rounded-md transition-all">
      <span className="text-xl">{icon}</span>
      {isOpen && <span className="text-base ml-3">{text}</span>}
    </Link>
  );
};

export default Sidebar;
