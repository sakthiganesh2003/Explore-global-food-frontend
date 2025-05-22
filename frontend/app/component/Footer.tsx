import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-gray-700">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center">
              <Image 
                src="/Explore.png" 
                alt="Cooking Master Logo" 
                width={60} 
                height={60}
                className="mr-3"
              />
              <span className="text-2xl font-bold text-orange-500">Cooking Master</span>
            </div>
            <p className="text-gray-400">
              Bringing culinary excellence to your doorstep with authentic flavors and premium ingredients.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  Our Menu
                </Link>
              </li>
              <li>
                <Link href="/chefs" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  Our Chefs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Dishes */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Popular Dishes</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/menu/butter-chicken" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  Butter Chicken
                </Link>
              </li>
              <li>
                <Link href="/menu/biryani" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  Hyderabadi Biryani
                </Link>
              </li>
              <li>
                <Link href="/menu/tandoori" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  Tandoori Platter
                </Link>
              </li>
              <li>
                <Link href="/menu/dosa" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  Masala Dosa
                </Link>
              </li>
              <li>
                <Link href="/menu/naan" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  Garlic Naan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-orange-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">123 Culinary Street, Food District, Mumbai 400001</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-orange-500 mr-3" />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-orange-500 mr-3" />
                <span className="text-gray-400">contact@cookingmaster.com</span>
              </li>
              <li className="flex items-center">
                <FaClock className="text-orange-500 mr-3" />
                <span className="text-gray-400">Open: 10:00 AM - 11:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} gegosoft. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;