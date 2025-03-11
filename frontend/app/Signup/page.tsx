"use client";
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

const SignupPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let valid = true;
    let tempErrors = { email: "", password: "", confirmPassword: "" };

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    // Validate password (e.g., minimum length of 6)
    if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters long.";
      valid = false;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Don't submit if form is invalid
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store the token in localStorage or cookies
        localStorage.setItem("token", data.token);

        toast.success(data.message || "Signup successful!");
        // Redirect to the next page, for example, the login page
        window.location.href = "/login";
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error("An error occurred during signup");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">
          Create an Account
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-500 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center">
          Already have an account?
          <Link href="/login" className="text-indigo-600 underline ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
