"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const SignUpComponent = () => {
  const router = useRouter();
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

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    let newErrors = { fullName: "", email: "", password: "", confirmPassword: "" };
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
      toast.error("Full name is required.", { position: "top-center" });
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      toast.error("Email is required.", { position: "top-center" });
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      toast.error("Enter a valid email address.", { position: "top-center" });
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
      toast.error("Password is required.", { position: "top-center" });
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
      toast.error("Please confirm your password.", { position: "top-center" });
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      toast.error("Passwords do not match.", { position: "top-center" });
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/maid/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Registration failed");
          localStorage.setItem("token", data.token);
          localStorage.setItem("userName", formData.fullName); // Store username
          return data;
        })
        .then((data) => {
          toast.success("Registration successful! Verification mail sent");
          
          return data;
        }),
      {
        loading: "Creating account...",
        success: "Registration successful! Verification mail sent.",
        error: (err) => `${err.message || "An error occurred during registration."}`,
      },
      {
        position: "top-center",
        duration: 4000,
        style: {
          minWidth: "300px",
        },
      }
    ).finally(() => setLoading(false));
  };

  return (
    <>
      <div className="min-h-screen bg-indigo-950 flex justify-center text-gray-500 items-center p-6">
        <div className="max-w-screen-xl bg-white shadow-lg rounded-lg flex w-full overflow-hidden justify-center gap-12">
          {/* Left Section - Sign Up Form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-600 mt-2">Get started with your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.fullName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"
                  }`}
                  placeholder="John Doe"
                  disabled={loading}
                />
                {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
              </div>

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"
                  }`}
                  placeholder="you@example.com"
                  disabled={loading}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"
                  }`}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} className="text-gray-500" /> : <Eye size={20} className="text-gray-500" />}
                </button>
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.confirmPassword ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"
                  }`}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={20} className="text-gray-500" /> : <Eye size={20} className="text-gray-500" />}
                </button>
                {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-800"
                }`}
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
                  "Create Account"
                )}
              </button>
            </form>

            {/* Terms and Sign In Link */}
            <p className="mt-4 text-sm text-center text-gray-600">
              By signing up, you agree to our{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-700">Terms & Privacy Policy</a>.
            </p>
            <p className="mt-4 text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link href="/maid/login/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>

          {/* Right Section - Illustration (Optional) */}
          <div className="hidden lg:flex items-center justify-center p-8">
            <Image
              src="https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg"
              alt="Signup Illustration"
              width={400}
              height={400}
              className="max-w-md"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpComponent;