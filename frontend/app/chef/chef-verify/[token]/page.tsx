"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

const VerifyInstructorEmailPage = () => {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string | undefined;

  const [message, setMessage] = useState("Verifying your instructor account...");
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // Use a ref to track if the API has already been called
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent multiple calls
    if (hasFetched.current) return;

    console.log("Extracted Token:", token);

    if (!token || typeof token !== "string") {
      setError("Invalid verification link.");
      return;
    }

    console.log(`Fetching: ${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-chef-email/${token}`);

    const verifyEmail = async () => {
      try {
        const response = await fetch(
         ` ${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-chef-email/${token}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
          setMessage(data.message || "chef account verified successfully!");
          setIsVerified(true);
          setTimeout(() => router.push("/"), 3000);
        } else {
          setError(data.message || "chef verification failed.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        // Mark as fetched even if there's an error
        hasFetched.current = true;
      }
    };

    // Call the function and mark as fetched
    verifyEmail();
    hasFetched.current = true;

    // Cleanup function (optional, for completeness)
    return () => {
      // No cleanup needed here, but included for best practice
    };
  }, [token, router]); // Dependencies remain the same

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#4a7c8a] to-[#1b374c] text-white text-center p-6">
      <div className="bg-white shadow-xl rounded-lg p-6 max-w-md w-full transform transition-all hover:scale-[1.02]">
        <div className="flex justify-center mb-4">
          {isVerified ? (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : error ? (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}
        </div>

        <h2 className={`text-2xl font-bold ${error ? "text-red-500" : "text-[#1b374c]"}`}>
          {error ? "Guide Verification Failed" : isVerified ? "Verification Complete!" : "Guide Email Verification"}
        </h2>
        <p className="mt-4 text-gray-700">{error || message}</p>

        {isVerified && (
          <div className="mt-6 p-4 bg-blue-50 rounded-md text-left">
            <h3 className="font-semibold text-blue-800">Next Steps:</h3>
         
          </div>
        )}

        {error && (
          <div className="mt-6 space-y-3">
            <button
              className="w-full bg-[#1b374c] text-white px-4 py-3 rounded-md hover:bg-opacity-90 transition font-medium"
              onClick={() => router.push("maid/login/signup")}
            >
              Try Signing Up Again
            </button>
            <button
              className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-md hover:bg-gray-300 transition font-medium"
              onClick={() => router.push("/contact-support")}
            >
              Contact Support
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyInstructorEmailPage;