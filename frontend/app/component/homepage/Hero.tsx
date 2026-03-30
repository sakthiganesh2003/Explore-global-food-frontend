"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import { ChefHat, ArrowRight, Star, Quote } from "lucide-react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const SliderHero = () => {
  const slides = [
    {
      image: "/slider1.png",
      title: "The Art of <span class='text-orange-500 underline decoration-white/20 underline-offset-8 decoration-wavy'>Fine Dining</span>",
      subtitle: "Experience culinary mastery with our world-class private chefs. Every dish is a masterpiece crafted uniquely for your taste.",
      cta_primary: "Explore Menu",
      cta_secondary: "Book a Cook",
      badge: "Gourmet Experience"
    },
    {
      image: "/slider2.png",
      title: "Master <span class='text-orange-500 underline decoration-white/20 underline-offset-8 decoration-wavy'>Chefs</span> at Home",
      subtitle: "Elevate your dining experience with professional chefs who bring the kitchen to you. Authentic flavors, expertly prepared.",
      cta_primary: "Meet our Chefs",
      cta_secondary: "View Plans",
      badge: "Professional Service"
    },
    {
      image: "/hero1.jpg",
      title: "Taste <span class='text-orange-500 underline decoration-white/20 underline-offset-8 decoration-wavy'>Global</span> Flavors",
      subtitle: "From traditional regional recipes to modern fusion, discover a world of taste across continents. Authenticity in every bite.",
      cta_primary: "Browse Categories",
      cta_secondary: "Learn More",
      badge: "Discover Local Culture"
    }
  ];

  return (
    <section className="relative h-screen w-full bg-black group">
      <Swiper
        spaceBetween={0}
        effect={'fade'}
        speed={1500}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} custom-bullet"></span>`;
          },
        }}
        navigation={{
           prevEl: ".hero-prev",
           nextEl: ".hero-next"
        }}
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              {/* Background with Zoom Effect */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                   initial={{ scale: 1.1 }}
                   animate={{ scale: 1 }}
                   transition={{ duration: 10 }}
                   className="h-full w-full"
                >
                  <Image
                    src={slide.image}
                    alt="Slider Image"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
                {/* Refined Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10"></div>
                <div className="absolute top-0 left-0 w-full h-[15%] bg-gradient-to-b from-black/80 to-transparent z-20"></div>
              </div>

              {/* Content Overlay */}
              <div className="relative z-30 h-full flex items-center px-6 sm:px-10 lg:px-20">
                <div className="max-w-4xl">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col space-y-6"
                  >
                    <div className="flex items-center gap-3">
                       <span className="w-12 h-[2px] bg-orange-500"></span>
                       <span className="text-orange-500 uppercase tracking-[0.4em] font-black text-xs md:text-sm">{slide.badge}</span>
                    </div>

                    <h1 
                      className="text-5xl sm:text-7xl md:text-9xl font-black text-white leading-none tracking-tighter"
                      dangerouslySetInnerHTML={{ __html: slide.title }}
                    ></h1>

                    <p className="text-gray-300 text-lg sm:text-xl md:text-2xl max-w-2xl leading-relaxed font-light italic">
                      &quot;{slide.subtitle}&quot;
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-6 sm:pt-8">
                       <Link
                         href="/explore"
                         className="group flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-500 text-white font-black px-8 py-4 sm:px-12 sm:py-6 rounded-2xl text-base sm:text-lg transition-all shadow-[0_30px_60px_rgba(234,88,12,0.4)] w-full sm:w-auto"
                       >
                         <span>{slide.cta_primary}</span>
                         <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-300" />
                       </Link>
                       
                       <Link
                         href="/maid"
                         className="inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 sm:px-12 sm:py-6 rounded-2xl text-base sm:text-lg transition-all border border-white/20 backdrop-blur-xl hover:border-white/40 w-full sm:w-auto overflow-hidden group"
                       >
                         <ChefHat size={22} className="text-orange-500 group-hover:scale-110 transition-transform" />
                         <span>{slide.cta_secondary}</span>
                       </Link>
                    </div>

                    {/* Meta stats in slide */}
                    <div className="pt-10 flex items-center gap-10 opacity-60">
                       <div className="flex flex-col">
                          <span className="text-2xl md:text-4xl font-black text-white">4.9/5</span>
                          <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">Quality Rating</span>
                       </div>
                       <div className="w-[1px] h-10 bg-white/20"></div>
                       <div className="flex flex-col">
                          <span className="text-2xl md:text-4xl font-black text-white">5k+</span>
                          <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">Happy Users</span>
                       </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Brushes */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-40 h-0 hidden lg:flex items-center justify-between px-10 pointer-events-none group-hover:opacity-100 transition-opacity">
           <button className="hero-prev w-14 h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-orange-600 hover:border-orange-500 transition-all pointer-events-auto active:scale-90">
              <ArrowRight className="rotate-180" size={24} />
           </button>
           <button className="hero-next w-14 h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-orange-600 hover:border-orange-500 transition-all pointer-events-auto active:scale-90">
              <ArrowRight size={24} />
           </button>
        </div>

        {/* Branding Sidebar */}
        <div className="absolute bottom-1/2 right-10 translate-y-1/2 rotate-90 origin-right z-30 hidden xl:flex items-center gap-6 opacity-30 text-white font-black tracking-[0.8em] uppercase text-xs">
           <span className="w-20 h-[1px] bg-white"></span>
           Global Food Explore 2026
        </div>
      </Swiper>

      <style jsx global>{`
        .custom-bullet {
          width: 50px !important;
          height: 3px !important;
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 0 !important;
          opacity: 1 !important;
          margin: 0 10px !important;
          transition: all 0.5s ease;
          position: relative;
          overflow: hidden;
        }
        .swiper-pagination-bullet-active {
          background: #f97316 !important;
          width: 80px !important;
        }
        .swiper-pagination-bullets {
          bottom: 50px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: auto !important;
        }
      `}</style>
    </section>
  );
};

export default SliderHero;