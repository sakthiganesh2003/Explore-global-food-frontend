"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    // Basic email validation using a regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage(""); // Clear success message if errors exist
    } else {
      setErrors({});
      setSuccessMessage("Successfully logged in!"); // Success message

      try {
        // API call to backend for login
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          // Store token in localStorage or cookies
          localStorage.setItem("token", data.token);
          localStorage.setItem("userName", data.user.name); // Store the user name

          // Redirect to the homepage or dashboard
          router.push("./"); // Redirect using Next.js router
        } else {
          setSuccessMessage("");
          setErrors({ email: "", password: data.error }); // Set error from backend response
        }
      } catch (error) {
        setSuccessMessage("");
        setErrors({ email: "", password: "An error occurred, please try again." }); // Handle API error
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Alert Box */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
            <p>{successMessage}</p>
          </div>
        )}

        {/* Error Alert */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            <p>Please fix the following errors:</p>
            <ul className="list-disc ml-5">
              {errors.email && <li>{errors.email}</li>}
              {errors.password && <li>{errors.password}</li>}
            </ul>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-4">Welcome Back</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Sign in to access your account.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 mt-1 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Removed required attribute
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full p-3 mt-1 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Removed required attribute
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>
            <Link href="/Forgetpassword" className="text-indigo-600 dark:text-indigo-400 text-sm">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-500 transition"
          >
            Sign in
          </button>
        </form>

        <p className="text-gray-600 dark:text-gray-400 text-sm mt-6 text-center">
          By proceeding, you agree to our
          <Link href="/terms" className="text-indigo-600 underline mx-1">
            Terms
          </Link>
          and
          <Link href="/privacy-policy" className="text-indigo-600 underline mx-1">
            Privacy Policy
          </Link>.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-6 text-center">
          Don't have an account?
          <Link href="/Signup" className="text-indigo-600 underline mx-1">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;