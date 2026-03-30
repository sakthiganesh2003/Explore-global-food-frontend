"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Play, Users, ChefHat, Timer } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Video with refined overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-[1]"></div>
        <video
          className="object-cover w-full h-full scale-105"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/vide/video5.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/20 rounded-full blur-[100px] z-[2] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] z-[2] animate-pulse"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 mt-16 md:mt-0">
        <div className="max-w-5xl mx-auto flex flex-col items-center pt-24 md:pt-32">
          
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tight">
                Authentic <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-600 drop-shadow-sm">
                  Culinary Stories
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                Connect with world-class private chefs and local cooking experts. 
                Experience regional flavors prepared fresh in the comfort of your home.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-6"
            >
              <Link
                href="/explore"
                className="group relative inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-500 text-white font-bold px-10 py-5 rounded-2xl text-lg transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)]"
              >
                <span>Browse Menu</span>
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-400 group-hover:translate-x-1 transition-transform">
                   <Play size={16} fill="white" />
                </div>
              </Link>
              
              <Link
                href="/maid"
                className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white font-semibold px-10 py-5 rounded-2xl text-lg transition-all border border-white/20 backdrop-blur-xl hover:border-white/40"
              >
                <ChefHat size={20} className="text-orange-400" />
                <span>Book a Cook</span>
              </Link>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16"
          >
            <StatItem icon={<ChefHat size={18} />} label="Professional Chefs" value="500+" />
            <StatItem icon={<Users size={18} />} label="Daily Bookings" value="1.2k" />
            <StatItem icon={<Timer size={18} />} label="Avg Response" value="15 min" />
            <StatItem icon={<Star size={18} />} label="Reviews" value="25k+" />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
             <motion.div 
               className="w-1 h-2 bg-orange-500 rounded-full"
               animate={{ y: [0, 4, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
             />
          </div>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
};

const StatItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex flex-col items-center md:items-start text-center md:text-left">
    <div className="flex items-center gap-2 text-orange-400 mb-1">
      {icon}
      <span className="text-xl md:text-2xl font-black text-white">{value}</span>
    </div>
    <span className="text-[10px] md:text-xs text-white/50 uppercase tracking-widest font-bold">{label}</span>
  </div>
);

export default HeroSection;