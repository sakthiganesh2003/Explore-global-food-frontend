"use client";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  [key: string]: unknown;
}

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);

        if (decoded.role !== "maid") {
          router.push("/maid/dashboard");
        }
      } catch (error) {
        console.error("Error decoding token", error);
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
};

export default AdminLayout;
