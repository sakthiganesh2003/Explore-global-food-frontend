"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
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
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 -z-10 overflow-hidden"
        >
          <Image
            src="/hero1.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </motion.div>
      </section>

      {/* 3. Value Proposition Cards */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🌟",
              title: "Premium Ingredients",
              description: "Locally sourced, organic produce for maximum freshness"
            },
            {
              icon: "👨‍🍳",
              title: "Expert Chefs",
              description: "Trained culinary artists with 10+ years experience"
            },
            {
              icon: "🚀",
              title: "Fast Delivery",
              description: "Hot meals delivered in under 30 minutes"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. About Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/Cultural Dishes.jpg"
                alt="Our Kitchen"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-3/4">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <span className="text-orange-500 text-2xl">🏆</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Award Winning</h3>
                  <p className="text-sm text-gray-600">Best Restaurant 2023</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <span className="text-orange-500 font-semibold tracking-wider">OUR STORY</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Crafting Culinary Excellence Since 2010
            </h2>
            <p className="text-lg text-gray-600">
              Founded with passion and precision, our restaurant blends traditional recipes with innovative techniques to create unforgettable dining experiences.
            </p>
            <div className="pt-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-orange-200">
                Learn More About Us
              </button>
            </div>
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