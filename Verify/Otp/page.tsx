"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

const OtpSendPage: React.FC = () => {
  const [otp, setOtp] = useState<string>("");

  const handleVerify = () => {
    toast.success("OTP Verified Successfully");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Enter OTP</h1>
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button onClick={handleVerify} className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-500 transition mt-4">
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default OtpSendPage;
