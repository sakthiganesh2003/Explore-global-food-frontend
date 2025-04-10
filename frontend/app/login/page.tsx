"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import useLogin from "../../hook/useLogin";
import toast from "react-hot-toast";

const SignInComponent = () => {
  const { handleLogin, error, isUnverified } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    await handleLogin(email, password);
    setLoading(false);
  };

  const resendVerificationEmail = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resendverification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification email sent! Check your inbox.");
      } else {
        toast.error(data.error || "Failed to resend verification email.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center bg-indigo-950">
      <div className="w-full max-w-md bg-zinc-300 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-24 h-24 md:w-36 md:h-36 rounded-full mb-4 bg-gray-800"
            style={{ backgroundImage: "url(/images/logo.png)" }}
          >
            <i className="fas fa-sign-in-alt text-red-600 fa-lg"></i>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-600 mt-2">Please sign in to continue</p>
        </div>

        {/* Show error message if login fails */}
        {error && !isUnverified && (
          <p className="text-sm text-red-600 mb-4 text-center">{error}</p>
        )}
        {isUnverified && (
          <div className="text-center mb-4">
            <p className="text-sm text-blue-600 mb-2">{error}</p>
            <button
              onClick={resendVerificationEmail}
              className="text-sm underline text-blue-600 hover:text-blue-800"
            >
              Resend verification email
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-red-600`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-red-600`}
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

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              href="/Verify/ForgotPassword"
              className="text-red-600 hover:text-red-700 font-semibold text-sm py-4 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-800 focus:ring-4 focus:ring-red-600"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="ml-2">Processing...</span>
              </div>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Link to Sign Up page */}
        <p className="mt-6 text-center text-gray-600">
          Do not have an account?{" "}
          <Link href="/Signup" className="ml-1 text-red-600 hover:text-red-700 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInComponent;