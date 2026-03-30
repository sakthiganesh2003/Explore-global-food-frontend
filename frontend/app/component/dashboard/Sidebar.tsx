"use client";

import { useState, useEffect } from "react";
import { Home, Menu, ChefHat, BookA, Book, IndianRupee, CalendarCog, MessagesSquare, ContactRound, Users, Banknote, ClockArrowUp, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsOpen(false);
      } else {
        setIsMobile(false);
        setIsOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar on navigation on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  return (
    <>
      {/* Mobile Top Header Bar (Fixes the "Left Corner" problem) */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-gray-950 border-b border-gray-800 flex items-center px-4 z-40 lg:hidden">
          <button
            className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="ml-4 font-black text-white text-lg tracking-tighter">
            ADMIN
          </Link>
        </div>
      )}

      {/* Mobile Backdrop Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`min-h-screen bg-gray-950 text-white shadow-2xl transition-all duration-300 z-[70] 
          ${isMobile ? 'fixed inset-y-0 left-0' : 'sticky top-0'}
          ${isOpen ? "translate-x-0 w-64" : (isMobile ? "-translate-x-full w-0" : "w-20")}
          ${!isOpen && isMobile ? "pointer-events-none opacity-0" : "opacity-100"}
        `}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-800/50">
          <Link 
            href="/" 
            className={`font-black text-xl tracking-tighter overflow-hidden whitespace-nowrap transition-all hover:text-indigo-400 ${isOpen ? 'w-auto' : 'w-0'}`}
          >
            ADMIN
          </Link>
          <button
            className={`flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none
              ${isOpen ? 'w-8 h-8 hover:bg-gray-800' : 'w-full h-10 hover:bg-indigo-600/20'}
            `}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isMobile && isOpen ? <X size={20} /> : <Menu size={20} className={!isOpen ? "text-indigo-400" : ""} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-1 mt-4 px-2 overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-hide">
          <SidebarItem icon={<Home size={20} />} text="Dashboard" href="/Admin" isOpen={isOpen} active={pathname === "/Admin"} />
          <SidebarItem icon={<BookA size={20} />} text="Cook Form" href="/Admin/Booking" isOpen={isOpen} active={pathname === "/Admin/Booking"} />
          <SidebarItem icon={<ChefHat size={20} />} text="Cook Status" href="/Admin/maidstatus" isOpen={isOpen} active={pathname === "/Admin/maidstatus"} />
          <SidebarItem icon={<Book size={20} />} text="Chef Form" href="/Admin/chef" isOpen={isOpen} active={pathname === "/Admin/chef"} />
          <SidebarItem icon={<ClockArrowUp size={20} />} text="Orders" href="/Admin/orders" isOpen={isOpen} active={pathname === "/Admin/orders"} />
          <SidebarItem icon={<Banknote size={20} />} text="Refunds" href="/Admin/refund" isOpen={isOpen} active={pathname === "/Admin/refund"} />
          <SidebarItem icon={<Users size={20} />} text="Users List" href="/Admin/users" isOpen={isOpen} active={pathname === "/Admin/users"} />
          <SidebarItem icon={<ChefHat size={20} />} text="Chef Posts" href="/Admin/chefposts" isOpen={isOpen} active={pathname === "/Admin/chefposts"} />
          <SidebarItem icon={<IndianRupee size={20} />} text="Payments" href="/Admin/paymenthistory" isOpen={isOpen} active={pathname === "/Admin/paymenthistory"} />
          <SidebarItem icon={<CalendarCog size={20} />} text="Earnings" href="/Admin/maidearnings" isOpen={isOpen} active={pathname === "/Admin/maidearnings"} />
          <SidebarItem icon={<MessagesSquare size={20} />} text="Feedback" href="/Admin/feedback" isOpen={isOpen} active={pathname === "/Admin/feedback"} />
          <SidebarItem icon={<ContactRound size={20} />} text="Contact Us" href="/Admin/contact" isOpen={isOpen} active={pathname === "/Admin/contact"} />
        </nav>
      </div>
    </>
  );
};

// Sidebar Item Component
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  href: string;
  isOpen: boolean;
  active?: boolean;
}

const SidebarItem = ({ icon, text, href, isOpen, active }: SidebarItemProps) => {
  return (
    <Link 
      href={href} 
      className={`flex items-center p-3 rounded-lg transition-all duration-200 group
        ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-gray-400 hover:bg-white/5 hover:text-white"}
      `}
    >
      <div className={`transition-transform duration-200 group-hover:scale-110 ${!isOpen && 'mx-auto'}`}>
        {icon}
      </div>
      {isOpen && (
        <span className="text-sm font-medium ml-3 overflow-hidden whitespace-nowrap">
          {text}
        </span>
      )}
    </Link>
  );
};

export default Sidebar;
