"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState(''); // User role
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // User profile dropdown
  const [isSigninOpen, setIsSigninOpen] = useState(false); // Sign-in options dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  const signinRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const updateUserInfo = () => {
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('userName');

      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setUsername(decoded.name || decoded.username || storedUsername || '');
          setUserRole(decoded.role || '');
        } catch (error) {
          console.error('Invalid token:', error);
          setUsername(storedUsername || '');
          setUserRole('');
        }
      } else {
        setUsername(storedUsername || '');
        setUserRole('');
      }
    };

    updateUserInfo();
    window.addEventListener('storage', updateUserInfo);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (signinRef.current && !signinRef.current.contains(event.target as Node)) {
        setIsSigninOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('storage', updateUserInfo);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUsername('');
    setUserRole('');
    setIsDropdownOpen(false);
    router.push('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsSigninOpen(false); // Close signin dropdown if open
  };

  const toggleSigninDropdown = () => {
    setIsSigninOpen(!isSigninOpen);
    setIsDropdownOpen(false); // Close user dropdown if open
  };

  // Visibility logic for role-specific links
  const showBecomeChef = username && userRole === 'chef'; // Show "Become Chef" if logged in and is a chef
  const showBecomeMaid = username && userRole === 'maid'; // Show "Become Maid" if logged in and is a maid

  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    switch (userRole) {
      case 'admin':
        return '/Admin';
      case 'maid':
        return '/maid/dashboard';
      case 'chef':
        return '/chef/dashboard';
      default:
        return username ? '/User/dashboard' : '/';
    }
  };

  // Determine dashboard label based on user role
  const getDashboardLabel = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin Dashboard';
      case 'maid':
        return 'Cook Dashboard';
      case 'chef':
        return 'Chef Dashboard';
      default:
        return username ? 'User Dashboard' : 'Dashboard';
    }
  };

  return (
    <nav className="sticky top-0 left-0 z-50 bg-[#059669] shadow-md px-10 py-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="relative group px-6 py-3 text-xl font-bold text-gray-800 hover:text-white transition-all duration-300"
        >
          {/* Underline animation */}
          <span className="absolute bottom-0 left-0 h-0.5 bg-emerald-400 w-0 group-hover:w-full transition-all duration-500"></span>
          {/* Floating dots */}
          <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></span>
          <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></span>
          <span className="relative z-10 tracking-wider">GLOBAL FOOD EXPLORE</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-white hover:border-b-2 border-white">
            Home
          </Link>
          <Link href="/explore" className="text-white hover:border-b-2 border-white">
            Explore
          </Link>
          <Link href="/chef/recipespost" className="text-white hover:border-b-2 border-white">
            Chef Dish
          </Link>
          <Link href="/maid" className="text-white hover:border-b-2 border-white">
            Cook
          </Link>
          <Link href="/User/about" className="text-white hover:border-b-2 border-white">
            About
          </Link>
          <Link href="/User/contactas" className="text-white hover:border-b-2 border-white">
            Contact Us
          </Link>
        </div>

        {/* User Info & Authentication Buttons */}
        <div className="flex items-center space-x-4 relative">
          {username ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <span className="text-white font-semibold capitalize">
                  {username} ({userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'})
                </span>
                <svg
                  className={`w-4 h-4 text-white transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href={getDashboardLink()}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {getDashboardLabel()}
                  </Link>
                  {showBecomeChef && (
                    <Link
                      href="/chef/becomechef"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Become Chef
                    </Link>
                  )}
                  {showBecomeMaid && (
                    <Link
                      href="/maid/becomemaid"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Become cook form
                    </Link>
                  )}
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
            <div className="relative" ref={signinRef}>
              <button
                onClick={toggleSigninDropdown}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 focus:outline-none"
              >
                Sign in
              </button>
              {isSigninOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSigninOpen(false)}
                  >
                    User Signin
                  </Link>
                  <Link
                    href="/maid/login/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSigninOpen(false)}
                  >
                    Cook Signin
                  </Link>
                  <Link
                    href="/chef/login/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSigninOpen(false)}
                  >
                    Chef Signin
                  </Link>
                  <Link
                    href="/admin/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSigninOpen(false)}
                  >
                    Admin Signin
                  </Link>
                </div>
              )}
            </div>
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
            <Link
              href="/"
              className="text-white hover:border-b-2 border-white py-2"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="text-white hover:border-b-2 border-white py-2"
              onClick={() => setIsOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/chef"
              className="text-white hover:border-b-2 border-white py-2"
              onClick={() => setIsOpen(false)}
            >
              Chef Dish
            </Link>
            <Link
              href="/maid"
              className="text-white hover:border-b-2 border-white py-2"
              onClick={() => setIsOpen(false)}
            >
              Cook
            </Link>
            {username && (
              <Link
                href={getDashboardLink()}
                className="text-white hover:border-b-2 border-white py-2"
                onClick={() => setIsOpen(false)}
              >
                {getDashboardLabel()}
              </Link>
            )}
            {showBecomeChef && (
              <Link
                href="/frontend/chef/becomechef"
                className="text-white hover:border-b-2 border-white py-2"
                onClick={() => setIsOpen(false)}
              >
                Become Chef
              </Link>
            )}
            {showBecomeMaid && (
              <Link
                href="/maid/becomemaid"
                className="text-white hover:border-b-2 border-white py-2"
                onClick={() => setIsOpen(false)}
              >
                Become Maid
              </Link>
            )}
            {username && (
              <button
                onClick={handleLogout}
                className="text-white hover:border-b-2 border-white py-2"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;