"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="bg-white  md:px-12 py-16 relative overflow-hidden h-screen">
      {/* Background Video */}
      <div className="absolute inset-0 z-[1] mix-blend-multiply bg-gradient-to-r from-gray-800  to-black">
        <video
          className="object-cover w-full h-full"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/vide/video5.mp4" type="video/mp4" />
          {/* Fallback content in case the video fails to load */}
          <p>Your browser does not support the video tag or there was an error loading the video.</p>
        </video>
      </div>

      {/* Hero Section Layout */}
      <div className="flex flex-col mt-32  items-center  relative ">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 text-center md:text-left relative z-10 mt-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white ">
            Explore Global cuisine <br />{" "}
            <span className="text-orange-500">to Your Taste Buds</span>
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Exquisite food for your special dining experience. What do you want to order?
          </p>
          <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/order"
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition-all"
              >
                Explore Now
              </Link>
            </motion.div>

            <br/>

            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/menu"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Book Maid
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Content - Animated Food Image */}
        
      </div>

      {/* Featured Dishes Section */}
    </div>
  );
};

export default HeroSection;
