import React from 'react'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';


const Footer = () => {
  return (
    <div className='pt-20 pb-12 bg-black'>
        {/* Definr grid */}
        <div className='w-[80%] mx-auto grid items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-8 border-b-[1.5px] border-white border-opacity-20'>
            {/* 1st footer part */}
            <div>
                <Image src='/chef.png' alt='Logo' height={75} width={75} />
                <p className='text-white text-opacity-50'>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                </p>
                {/* social link */}
                <div className='flex items-center space-x-4 mt-6'>
                    <FaFacebook className='w-6 h-6 text-blue-600' />
                    <FaTwitter className='w-6 h-6 text-sky-500' />
                    <FaYoutube className='w-6 h-6 text-red-700'/>
                    <FaInstagram className='w-6 h-6 text-pink-600'/>
                </div>
            </div>
            {/* 2nd footer part */}
            <div>
                <h1 className='footer_heading'>Popular</h1>
                <p className='footer_link'>Web development</p>
                <p className='footer_link'>Hacking</p>
                <p className='footer_link'>UI/UX Design</p>
                <p className='footer_link'>App Development</p>
                <p className='footer_link'>Desktop Development</p>
                <p className='footer_link'>Digital Marketing</p>
            </div>
            {/* 3rd footer part */}
            <div>
                <h1 className='footer_heading'>Quick Link</h1>
                <p className='footer_link'><Link href="#Hero">Home</Link></p>
                <p className='footer_link'><Link href="#About">About</Link></p>
                <p className='footer_link'>Courses</p>
                <p className='footer_link'>Instructor</p>
                <p className='footer_link'>Profile</p>
                <p className='footer_link'>Privacy Policy</p>
            </div>
        </div>
        <p className='text-center mt-4 text-base text-white opacity-70'>@Copyright 2025 by Cooking </p>
    </div>
  )
}

export default Footer;