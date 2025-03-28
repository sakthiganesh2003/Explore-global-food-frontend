'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const updateUserInfo = () => {
      const token = localStorage.getItem("token");
      const storedUsername = localStorage.getItem("userName");

      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          console.log('Decoded Token:', decoded); // Debugging
          setUsername(decoded.name || decoded.username || storedUsername || "");
        } catch (error) {
          console.error("Invalid token:", error);
          setUsername(storedUsername || "");
        }
      } else {
        setUsername(storedUsername || "");
      }
    };

    // Initial load
    updateUserInfo();

    // Listen to changes in localStorage across tabs
    window.addEventListener("storage", updateUserInfo);

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", updateUserInfo);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUsername("");
    setIsDropdownOpen(false);
    router.push("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="sticky top-0 left-0 z-50 bg-[#059669] shadow-md px-10 py-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link href="/">
          <Image src="/icon/food1.png" alt="Logo" height={50} width={50} />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-white hover:border-b-2 border-white">Home</Link>
          <Link href="/explore" className="text-white hover:border-b-2 border-white">Explore</Link>
          <Link href="/chef" className="text-white hover:border-b-2 border-white">Chef dish</Link>
          <Link href="/maid" className="text-white hover:border-b-2 border-white">Cook</Link>
        </div>

        {/* User Info & Authentication Buttons */}
        <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
          {username ? (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <span className="text-white font-semibold capitalize">{username}</span>
                <svg 
                  className={`w-4 h-4 text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link 
                    href="/maid/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/maid/becomemaid" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Become Maid
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700">
                Sign in
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-green-700">
          <div className="flex flex-col items-center py-3 space-y-2">
            <Link href="/" className="text-white hover:border-b-2 border-white py-2">Home</Link>
            <Link href="/explore" className="text-white hover:border-b-2 border-white py-2">Explore</Link>
            <Link href="/chef" className="text-white hover:border-b-2 border-white py-2">Chef dish</Link>
            <Link href="/maid" className="text-white hover:border-b-2 border-white py-2">Maid Booking</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;