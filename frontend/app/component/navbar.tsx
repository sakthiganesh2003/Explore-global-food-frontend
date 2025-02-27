'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("userRole");

    if (storedUsername) setUsername(storedUsername);
    if (storedRole) setUserRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setUsername("");
    setUserRole("");
   
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
          <Link href="/maid" className="text-white hover:border-b-2 border-white">Maid booking</Link>
        </div>

        {/* User Info & Authentication Buttons */}
        <div className="flex items-center space-x-4">
          {username ? (
            <>
              <span className="text-white font-semibold">{username}</span>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
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
