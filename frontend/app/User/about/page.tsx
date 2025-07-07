'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaAward, FaUtensils, FaLeaf, FaUsers } from 'react-icons/fa';
import Navbar from '@/app/component/navbar';

const AboutPage = () => {
  return (
    <div className="bg-white">
        < Navbar/>
      {/* Hero Section */}
      <section className="relative h-96 w-full">
        <Image
          src="/french.jpg"
          alt="Our Restaurant Kitchen"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Our Story</h1>
            <p className="text-xl text-orange-300 max-w-2xl mx-auto">
              Passion, tradition, and innovation in every dish we serve
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/mexican.jpg"
                alt="Restaurant Interior"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              From Humble Beginnings to Culinary Excellence
            </h2>
            <p className="text-gray-600">
              Founded in 2010 by Chef Rajesh Kumar, Cooking Master began as a small family-owned restaurant in Mumbai. 
              What started as a passion project to share authentic Indian flavors has grown into an award-winning 
              culinary destination known for its innovative take on traditional recipes.
            </p>
            <p className="text-gray-600">
              Our journey has been guided by one simple principle: food should tell a story. Each dish on our menu 
              reflects the rich culinary heritage of India while incorporating modern techniques and presentation.
            </p>
            <div className="pt-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-all">
                Meet Our Chefs
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at Cooking Master
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaAward className="w-8 h-8 text-orange-500" />,
                title: "Quality Excellence",
                description: "We source only the finest ingredients and maintain rigorous quality standards"
              },
              {
                icon: <FaUtensils className="w-8 h-8 text-orange-500" />,
                title: "Culinary Innovation",
                description: "Traditional recipes meet modern techniques for unique flavor experiences"
              },
              {
                icon: <FaLeaf className="w-8 h-8 text-orange-500" />,
                title: "Sustainability",
                description: "Ethical sourcing and eco-friendly practices in all our operations"
              },
              {
                icon: <FaUsers className="w-8 h-8 text-orange-500" />,
                title: "Community",
                description: "Building relationships through food and shared dining experiences"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg text-center"
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Meet Our Culinary Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The talented chefs behind our exceptional dining experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Chef Rajesh Kumar",
              role: "Executive Chef & Founder",
              image: "/chef1.jpg",
              bio: "With over 25 years of experience, Chef Rajesh brings traditional family recipes to life with modern flair."
            },
            {
              name: "Chef Priya Sharma",
              role: "Head Pastry Chef",
              image: "/chef2.jpg",
              bio: "Specializing in Indian desserts, Chef Priya creates sweet masterpieces that delight our guests."
            },
            {
              name: "Chef Arjun Patel",
              role: "Sous Chef",
              image: "/chef3.jpg",
              bio: "Expert in regional Indian cuisines, Chef Arjun ensures authentic flavors in every dish."
            }
          ].map((chef, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={chef.image}
                  alt={chef.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">{chef.name}</h3>
                <p className="text-orange-500 mb-3">{chef.role}</p>
                <p className="text-gray-600">{chef.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Our Cuisine?</h2>
          <p className="text-xl mb-8">
            Book your table today and embark on a culinary journey through India&apos;s diverse flavors
           </p>

          <button className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg">
            Reserve Your Table
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;