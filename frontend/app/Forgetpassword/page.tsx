// pages/Forgetpassword/page.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending reset link
    setMessage("If your email is registered, you will receive a password reset link.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">
          Forgot Password?
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          Enter your email address below to receive a password reset link.
        </p>
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-500 transition"
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-gray-600 dark:text-gray-400 text-center text-sm mt-4">
          Remembered your password?
          <Link href="/login" className="text-indigo-600 underline mx-1">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
