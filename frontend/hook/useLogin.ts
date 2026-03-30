"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "https://explorer-global-food-backend.vercel.app";

const useLogin = () => {
  const [error, setError] = useState("");
  const [isUnverified, setIsUnverified] = useState(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setError("");
    setIsUnverified(false);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Please verify your email before logging in") {
          setIsUnverified(true);
        }
        setError(data.error || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/");
    } catch (error: any) {
      setError("Something went wrong. Please try again.");
    }
  };

  return { error, isUnverified, handleLogin };
};

export default useLogin;