"use client";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string;
  // you can add more fields like exp, name, email, etc. if needed
}

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (decoded.role !== "chef") {
          router.push("/login");
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
