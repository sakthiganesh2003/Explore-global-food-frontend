"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={ref} className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* 1. Navigation */}
      <Navbar />

      {/* 2. Hero Section (Full Viewport) */}
      <section className="relative h-screen p-0 border-spacing-1">
        <Hero />
      </section>

      {/* 3. Value Proposition Cards */}
      <section className="relative py-24 px-4 bg-white overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter sm:text-5xl">
              Why We Are <span className="text-emerald-600">The Best</span> Choice
            </h2>
            <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: "🌟",
                title: "Premium Ingredients",
                description: "Locally sourced, organic produce for maximum freshness and flavor in every bite.",
                color: "emerald"
              },
              {
                icon: "👨‍🍳",
                title: "Expert Chefs",
                description: "Trained culinary artists with deep expertise in regional and global cuisines.",
                color: "orange"
              },
              {
                icon: "🚀",
                title: "On-Time Service",
                description: "Reliable scheduling and punctual service, whether it is for a party or daily meals.",
                color: "indigo"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                className="group relative bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${item.color}-50 rounded-bl-full -z-10 transition-all group-hover:scale-150`}></div>
                <span className="text-5xl mb-6 block transform transition-transform group-hover:scale-110 group-hover:rotate-12">{item.icon}</span>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                <div className="mt-6 flex items-center text-emerald-600 font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <span className="ml-2">→</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. About Section */}
      <section className="py-32 px-4 bg-gray-950 text-white relative overflow-hidden">
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/10 group">
              <Image
                src="/Cultural Dishes.jpg"
                alt="Our Kitchen"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
            </div>
            {/* Floating Accolade Card */}
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute -bottom-10 -right-4 md:-right-10 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-xs hidden sm:block"
            >
              <div className="flex items-center gap-5">
                <div className="bg-emerald-100 p-4 rounded-2xl">
                  <span className="text-emerald-600 text-3xl font-black italic">#1</span>
                </div>
                <div>
                   <h4 className="text-gray-900 font-black text-lg mb-1 leading-none uppercase tracking-tighter">Kitchen Platform</h4>
                   <p className="text-gray-500 text-xs font-bold leading-none">Voted by 50k+ food critics</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-[2px] bg-emerald-500"></div>
               <span className="text-emerald-500 uppercase tracking-[0.3em] font-black text-sm">Experience Excellence</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">
              Where <span className="text-emerald-500">Passion</span> <br />
              Meets Your Taste.
            </h2>
            <p className="text-gray-400 text-xl leading-relaxed mb-10 font-normal">
              We bridge the gap between world-class culinary masters and your dining table. Our mission is to provide an unforgettable gastronomic journey by bringing diverse cultures to your kitchen.
            </p>
            <ul className="space-y-6 mb-12">
               {["Only Certified Master Chefs", "Customized Meal Plans", "24/7 Premium Support"].map((text, i) => (
                 <li key={i} className="flex items-center gap-4 text-lg font-bold group">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">✓</div>
                    {text}
                 </li>
               ))}
            </ul>
            <Link href="/explore" className="inline-block px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-[0_20px_40px_rgba(5,150,105,0.3)] uppercase tracking-widest text-sm translate-y-0 active:translate-y-1">
               Discover More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 5. Cuisine Showcase */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-orange-500 font-semibold tracking-wider">OUR SPECIALTIES</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
              Explore Global Flavors
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Indian Cuisine",
                image: "/Indian.jpg",
                description: "Aromatic spices and rich flavors",
                dishes: ["Butter Chicken", "Biryani", "Masala Dosa"]
              },
              {
                name: "Japanese Cuisine", 
                image: "/japan.jpg",
                description: "Delicate balance of taste and presentation",
                dishes: ["Sushi Platter", "Ramen", "Tempura"]
              },
              {
                name: "Italian Cuisine",
                image: "/itallian.jpg",
                description: "Comfort food with bold flavors",
                dishes: ["Pasta Carbonara", "Margherita Pizza", "Tiramisu"]
              }
            ].map((cuisine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg"
              >
                <div className="h-80 relative">
                  <Image
                    src={cuisine.image}
                    alt={cuisine.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-2xl font-bold mb-2">{cuisine.name}</h3>
                    <p className="text-orange-200 mb-3">{cuisine.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {cuisine.dishes.map((dish, i) => (
                        <span key={i} className="bg-white/10 text-white/90 px-3 py-1 rounded-full text-sm">
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Chef Showcase */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-orange-500 font-semibold tracking-wider">MEET THE TEAM</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
              Our Master Chefs
            </h2>
          </motion.div>
          <ChefSwiper />
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-orange-500 font-semibold tracking-wider">TESTIMONIALS</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The best dining experience I've had this year! The flavors were incredible.",
                author: "Sarah Johnson",
                role: "Food Critic"
              },
              {
                quote: "Every dish tells a story. The attention to detail is remarkable.",
                author: "Michael Chen",
                role: "Regular Customer"
              },
              {
                quote: "Perfect balance of flavors and textures. Will definitely return!",
                author: "Emma Rodriguez",
                role: "First-time Visitor"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
              >
               <div className="text-orange-400 text-4xl mb-4">&ldquo;</div>

                <p className="text-gray-600 italic mb-6">{testimonial.quote}</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call to Action */}
      <section className="py-28 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Experience Our Cuisine?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Reserve your table today or order online for a delicious meal at home
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg">
              Book a Now
            </button>
            <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg transition-all">
              Order Online
            </button>
          </div>
        </motion.div>
      </section>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
}