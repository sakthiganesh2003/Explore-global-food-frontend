"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// Define the expected response type
interface SignupResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [isNameTaken, setIsNameTaken] = useState(false);

  const handleSignup = async (data: { name: string; email: string; password: string }) => {
    // Smart URL Fallback
    const apiUrl = (!process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL.includes('localhost')) 
      ? 'https://explorer-global-food-backend.vercel.app' 
      : process.env.NEXT_PUBLIC_API_URL;

    setLoading(true);
    setServerMessage("");
    setIsNameTaken(false);
    console.log("🔍 Sending Signup Request:", data);

    try {
      const response = await axios.post<SignupResponse>(
        `${apiUrl}/api/auth/signup`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Signup Response:", response.data);
      const { token, user } = response.data;

      if (user?.id && user?.name && user?.role && token) {
        localStorage.setItem("token", token);
        setServerMessage("✅ Signup successful! Redirecting...");
        toast.success("✅ Signup successful! Check your email to verify your account.");
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error: any) {
      console.error("❌ Signup Error:", error);

      if (error.response) {
        console.error("🚨 Server Response:", error.response.data);

        // Handle name conflict differently
        if (error.response.data.info && error.response.data.isNameTaken) {
          setServerMessage(error.response.data.info);
          setIsNameTaken(true);
          toast(error.response.data.info, {
            icon: "ℹ",
            style: {
              background: "#f0f7ff",
              color: "#0066cc",
            },
          });
        }
        // Handle other errors normally
        else {
          setServerMessage(error.response.data.message || "Signup failed");
          toast.error(error.response.data.message || "❌ Signup failed. Please try again.");
        }
      } else if (error.request) {
        console.error("🚫 No Response from Server");
        setServerMessage("Server is not responding. Please try again later.");
        toast.error("Server is not responding. Please try again later.");
      } else {
        console.error("❌ Unknown Error:", error.message);
        setServerMessage("An unexpected error occurred. Please try again.");
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleSignup, loading, serverMessage, isNameTaken };
};

export default useSignup;