'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 left-0 z-50 bg-[#059669] shadow-md px-10 py-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Image src='/icon/food1.png' alt='Logo' height={50} width={50} />
                           

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-white hover:border-b-2 border-white">Home</Link>
          <Link href="/explore" className="text-white hover:border-b-2 border-white">Explore</Link>
          <Link href="/chef" className="text-white hover:border-b-2 border-white">Chef dish</Link>
          <Link href="/maid" className="text-white hover:border-b-2 border-white">Maid booking</Link>
        </div>

        {/* Sign-in Button */}
        
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black-700">
            <Link href="/login" className="text-white">
              Sign in
            </Link>
          </button>


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
        <div className="md:hidden bg-transprant ">
          <div className="flex flex-col items-center py-3">
            <Link href="/" className="text-white hover:border-b-2 border-white py-2">Home</Link>
            <Link href="/explore" className="text-white hover:border-b-2 border-white  py-2">Explore</Link>
            <Link href="/chef" className="text-white hover:border-b-2 border-white py-2">Chef dish</Link>
            <Link href="/maid" className="text-white hover:border-b-2 border-white py-2">Maid Booking</Link>
            
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
