"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ChefSwiper from "@/app/component/ChefSwiper";
import Navbar from "@/app/component/navbar";
import Footer from "@/app/component/Footer";
import Hero from "@/app/component/homepage/Hero";



export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <div ref={ref} className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      <div className="bg-gray-900 text-white p-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        {/* Left Side (Image & Cards) */}
        <div className="relative w-full md:w-1/2"> 
          <img
            src="/maid/re.jpg"
            alt="Restaurant"
            className="rounded-lg shadow-lg w-full"
          />
          {/* Card Container */}
          <div className="absolute top-5 left-5 md:left-10 bg-gray-800 p-4 rounded-lg w-60 gap-2">
            <span className="text-orange-400 text-xl">🔥 High Quality</span>
            <p className="text-sm">Lorem ipsum dolor sit amet consectetur.</p>
          </div>
          
          <div className="absolute top-44 left-5 md:left-10 bg-gray-800 p-4 rounded-lg w-60">
            <span className="text-orange-400 text-xl">👨‍🍳 Top Cheft</span>
            <p className="text-sm">Nam libero tempore cum soluta.</p>
          </div>
        </div>

        

        {/* Right Side (Text) */}
        <div className="w-full md:w-1/2 p-10 text-center md:text-left">
          <h3 className="text-orange-400 text-lg">About</h3>
          <h1 className="text-4xl font-bold">We Serve Tasty Grilled Goodness!</h1>
          <p className="text-gray-400 mt-4">
            Figma ipsum component variant main layer. Asset bullet project
            prototype draft main. Select clip prototype flows content.
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 mt-4 rounded-lg">
            Learn More
          </button>
        </div>
      </div>
    </div>


      {/* Cuisine Showcase */}
      <motion.div style={{ y: textY }} className="container mx-auto py-16 px-6 text-center">
        <h2 className="text-4xl font-bold mb-12 text-gray-800">Discover Global Cuisines</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { name: "Indian", image: "/indian.jpg" },
            { name: "Japanese", image: "/japan.jpg" },
            { name: "American", image: "/amarican.jpg" },
            { name: "Mexican", image: "/mexican.jpg" },
            { name: "French", image: "/french.jpg" },
            { name: "Thai", image: "/thai.jpg" },
          ].map((cuisine, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              <img
                src={cuisine.image}
                alt={cuisine.name}
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-white text-2xl font-bold">{cuisine.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Video Recipe Section with Parallax Effect */}
      <motion.div style={{ y: videoY }} className="relative bg-cover bg-center py-16 px-6 text-white text-center md:text-left">
        <div className="bg-black bg-opacity-60 p-10 rounded-xl flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-3xl font-bold">Garlic Stir-Fried Spinach</h2>
            <p className="text-lg">A foolproof way to sauté bright green, flavorful leafy greens.</p>
            <button className="bg-yellow-500 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition-all">
              Get the Recipe
            </button>
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <iframe
              className="w-full aspect-video rounded-lg shadow-lg"
              src="https://www.youtube.com/embed/5rZ0Jqp1VcY"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </motion.div>

      {/* Chef Swiper */}
      <div className="py-16">
        <ChefSwiper />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
