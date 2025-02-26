"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaTwitter, FaFacebook } from "react-icons/fa";

const teamMembers = [
  {
    name: "Oliver Aguilera",
    role: "Product Manager",
    image: "/chef1.jpg", 
  },
  {
    name: "Marta Clermont",
    role: "Design Team Lead",
    image: "/chef2.jpg", 
  },
  {
    name: "Alice Melbourne",
    role: "Human Resources",
    image: "/chef3.jpg", 
  },
  {
    name: "John Doe",
    role: "Good Guy",
    image: "/chef4.jpg", 
  },
];

export default function TeamSection() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="text-center">
        <motion.h3 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-sm font-semibold text-green-500 tracking-wide uppercase"
        >
          Discover Our Team
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
          className="text-gray-600 mt-2 max-w-lg mx-auto"
        >
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
        </motion.p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-10 px-6 lg:px-20">
        {teamMembers.map((member, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-32 h-32 mx-auto overflow-hidden rounded-md mb-4">
              <Image src={member.image} width={150} height={150} className="rounded-lg" alt={member.name} />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
            <p className="text-sm text-gray-500">{member.role}</p>

            {/* Social Icons */}
            <div className="flex justify-center space-x-3 mt-3">
              <a href="#" className="text-gray-500 hover:text-blue-500 transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition">
                <FaFacebook size={20} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
