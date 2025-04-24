"use client";

import { useState } from "react";
import { Home, BookOpen, CreditCard, Menu, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SidebarMaid = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={`h-screen bg-gray-900 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-4">
        <button
          className="focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-4 mt-4 px-2">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center p-3 hover:bg-gray-700 rounded-md transition-all text-white"
          aria-label="Back to previous page"
        >
          <ArrowLeft size={20} />
          {isOpen && <span className="text-base ml-3">Back</span>}
        </button>

        <SidebarItem icon={<Home />} text="Home" href="/maid/dashboard" isOpen={isOpen} />
        <SidebarItem icon={<BookOpen />} text="Orders" href="/maid/dashboard/Booking" isOpen={isOpen} />
        <SidebarItem icon={<CreditCard />} text="Payment" href="/maid/dashboard/Payment" isOpen={isOpen} />
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

export default SidebarMaid;