"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  role: string;
  exp?: number;
  [key: string]: unknown;
};

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);

        if (decoded.role !== "admin") {
          router.push("/Admin");
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
