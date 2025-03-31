"use client"
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

const adminLayout = ({ children }: { children: ReactNode }) => {

    const router = useRouter();

useEffect(() => {
  // Get the token from localStorage
  const token = localStorage.getItem("token");

  if (token) {
    try {
      // Decode the token
      const decoded: any = jwtDecode(token);

      // Check if the role is 'instructor'
      if (decoded.role !== "admin") {
        // If the role is not 'instructor', redirect to login
        router.push("/Admin");
      }
    } catch (error) {
      console.error("Error decoding token", error);
      // If decoding fails, redirect to login
      router.push("/login");
    }
  } else {
    // If no token, redirect to login
    router.push("/login");
  }
}, [router]);



return(
    <>
    {children}
    </>
)}
export default adminLayout;