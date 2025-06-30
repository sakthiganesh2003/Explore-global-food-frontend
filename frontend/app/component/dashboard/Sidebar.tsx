"use client";

import { useState } from "react";
import { Home, Utensils, BookOpen, CreditCard, Menu, ChefHat,BookA ,Book,IndianRupee ,CalendarCog,MessagesSquare,ContactRound,Users,Banknote,ClockArrowUp} from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`min-h-screen fixed-max bg-gray-900 sticky top-0 left-0 z-50 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
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
        <SidebarItem icon={<BookA />} text="Cook Form" href="/Admin/Booking" isOpen={isOpen} />
        
        <SidebarItem icon={<ChefHat />} text="Cook Status" href="/Admin/maidstatus" isOpen={isOpen} />
        <SidebarItem icon={<Book />} text="Chef form" href="/Admin/chef" isOpen={isOpen} />
        <SidebarItem icon={<ClockArrowUp />} text="Orders" href="/Admin/orders" isOpen={isOpen} />
        <SidebarItem icon={<Banknote />} text="Refunds" href="/Admin/refund" isOpen={isOpen} />
        <SidebarItem icon={<Users />} text="Users" href="/Admin/users" isOpen={isOpen} />
        <SidebarItem icon={<ChefHat />} text="Chefposts" href="/Admin/chefposts" isOpen={isOpen} />
        <SidebarItem icon={<IndianRupee/>} text="Payment history" href="/Admin/paymenthistory" isOpen={isOpen} />
        <SidebarItem icon={<CalendarCog />} text="Cook earnings" href="/Admin/maidearnings" isOpen={isOpen} />
        <SidebarItem icon={<MessagesSquare />} text="Feedback" href="/Admin/feedback" isOpen={isOpen} />
        <SidebarItem icon={<ContactRound />} text="Contact" href="/Admin/contact" isOpen={isOpen} />
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
