"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(""); // OTP input value
  const [message, setMessage] = useState(""); // Success message
  const [error, setError] = useState(""); // Error message
  const [email, setEmail] = useState(""); // User email for OTP verification
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract email from query params
  useEffect(() => {
    const userEmail = searchParams.get("email");
    if (userEmail) {
      setEmail(userEmail);
    } else {
      setError("Email not provided. Please restart the reset process.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-reset-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
     
          otp: otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "OTP verified successfully!");
        setTimeout(() => {
          if (email) {
            router.push(`/Verify/Changepassword`);
          } else {
            setError("Email is missing. Please try again.");
          }
        }, 1500);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error("OTP Verification Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "OTP resent successfully!");
      } else {
        setError(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error("Resend OTP Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">
          OTP Verification
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          Enter the OTP sent to your registered email.
        </p>

        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            id="otp"
            type="text"
            maxLength={6}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Allow only numeric input
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-500 transition disabled:opacity-50"
            disabled={isLoading || !otp || otp.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleResend}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-md transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;