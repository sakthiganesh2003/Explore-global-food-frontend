/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',         // For local development images
      'res.cloudinary.com' // For Cloudinary images
      // Add other specific domains if needed, e.g., 'example.com'
    ],
  },
};

module.exports = nextConfig;