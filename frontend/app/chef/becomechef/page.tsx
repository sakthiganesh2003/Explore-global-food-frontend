"use client";
import { useState } from "react";
import Head from "next/head";

type ChefFormData = {
  name: string;
  experienceYears: number;
  specialty: string;
  certificationFile?: File | null;
  agreeToTerms: boolean;
};

export default function ChefRegistrationForm() {
  const [formData, setFormData] = useState<ChefFormData>({
    name: "",
    experienceYears: 0,
    specialty: "",
    certificationFile: null,
    agreeToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({
        ...prev,
        certificationFile: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("experienceYears", formData.experienceYears.toString());
      formDataToSend.append("specialty", formData.specialty);
      formDataToSend.append("agreeToTerms", formData.agreeToTerms.toString());
      if (formData.certificationFile) {
        formDataToSend.append("certificationFile", formData.certificationFile);
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/chefs/register`, {
        method: "POST",
        body: formDataToSend,
      });

      const text = await response.text();
      console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.error || `Failed to register chef (Status: ${response.status})`);
      }

      setSuccess(true);
    } catch (err) {
      console.error("Submit error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
      <Head>
        <title>Chef Registration | Chef Work</title>
      </Head>

      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">👨‍🍳 Chef Registration</h1>

        {success ? (
          <div className="p-4 bg-green-100 text-green-700 rounded-md">
            <p>✅ Success! Your chef application has been submitted.</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
                <p>❌ {error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="experienceYears"
                  className="block text-sm font-medium text-gray-700"
                >
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="experienceYears"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                  Culinary Specialty
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select your specialty</option>
                  <option value="Pastry">Pastry Chef</option>
                  <option value="Italian">Italian Cuisine</option>
                  <option value="Asian">Asian Fusion</option>
                  <option value="Vegan">Vegan/Vegetarian</option>
                  <option value="French">French Cuisine</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="certificationFile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Certification (Optional)
                </label>
                <input
                  type="file"
                  id="certificationFile"
                  name="certificationFile"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.png"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                  I agree to the terms and conditions
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Register as Chef"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
