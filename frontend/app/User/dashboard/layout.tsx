"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // If no token is found, redirect to login
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // Decode the token
      const decoded: DecodedToken = jwtDecode(token);
      console.log('Decoded Token:', decoded);

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      // Check if role is "user"
      if (decoded.role !== 'user') {
        router.push('/login');
        return;
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      {children}
    </div>
  );
}