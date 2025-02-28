"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  username: string;
  password: string;
  role: string;
  userId?: number;
}

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      router.push("/");
    }
  }, [router]);

  const toggleForm = (): void => {
    setIsSignUp((prev) => !prev);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const getUsers = (): User[] => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]") as User[];

    if (storedUsers.length === 0) {
      const defaultUsers: User[] = [
        { username: "admin123", password: "adminpass", role: "admin" },
        { username: "user123", password: "userpass", role: "user" },
        { username: "guide123", password: "guidepass", role: "guide" },
      ];
      localStorage.setItem("users", JSON.stringify(defaultUsers));
      return defaultUsers;
    }

    return storedUsers;
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const users = getUsers();

    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem("username", user.username);
      localStorage.setItem("userRole", user.role);
      router.push("/");
    } else {
      setError("Invalid username or password!");
    }
  };

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    let users = getUsers();
    if (users.some((u) => u.username === username)) {
      setError("Username already taken!");
      return;
    }

    // Generate a random userId
    const userId: number = Math.floor(Math.random() * 1000000);

    const newUser: User = { username, password, role: "user", userId };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Sign-up successful! Please log in.");
    toggleForm();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary p-6">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h1>

        {error && <p className="bg-red-500 text-white p-2 text-center rounded-md mb-4">{error}</p>}

        <form className="space-y-5" onSubmit={isSignUp ? handleSignUp : handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                required
              />
            </div>
          )}

          {!isSignUp && (
            <div className="text-right">
              <Link href="/verify/forget_password">
                <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                  Forgot Password?
                </span>
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-button hover:bg-opacity-80 text-white font-semibold py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          {isSignUp ? "Already have an account?" : "New here?"}{" "}
          <span
            onClick={toggleForm}
            className="text-blue-600 hover:underline font-medium cursor-pointer transition-all duration-300"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
