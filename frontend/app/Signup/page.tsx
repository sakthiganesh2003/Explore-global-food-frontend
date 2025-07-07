"use client";

import { useState } from 'react';
import Link from 'next/link';
import useSignup from "../../hook/useSignup";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

const SignUpComponent = () => {
  const { handleSignup, loading, serverMessage, isNameTaken } = useSignup();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 const validateForm = () => {
  const newErrors = { fullName: "", email: "", password: "", confirmPassword: "" };
  let isValid = true;

  if (!formData.fullName.trim()) {
    newErrors.fullName = "Full name is required.";
    isValid = false;
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required.";
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    newErrors.email = "Enter a valid email address.";
    isValid = false;
  }

  if (!formData.password.trim()) {
    newErrors.password = "Password is required.";
    isValid = false;
  }

  if (!formData.confirmPassword.trim()) {
    newErrors.confirmPassword = "Please confirm your password.";
    isValid = false;
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match.";
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
  setErrors({ ...errors, [name]: "" });
};


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await handleSignup({
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center bg-indigo-950 text-gray-800">
      <div className="w-full max-w-md bg-zinc-300 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 md:w-36 md:h-36 rounded-full mb-4 bg-gray-800">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={144}
              height={144}
              className="rounded-full"
            />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Get started with your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600"
              placeholder="John Doe"
            />
            {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
            {isNameTaken && <p className="mt-2 text-sm text-blue-600">{serverMessage}</p>}
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10 text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* Server Message */}
          {serverMessage && !isNameTaken && (
            <p className="mb-4 text-center text-sm text-red-600">{serverMessage}</p>
          )}
          {serverMessage && serverMessage.includes("successful") && (
            <p className="mb-4 text-center text-sm text-green-600">{serverMessage}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-800 focus:ring-4 focus:ring-red-600"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2">Processing...</span>
              </div>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Link to Sign In page */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="ml-1 text-red-600 hover:text-red-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpComponent;