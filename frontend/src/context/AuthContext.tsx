"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { checkAuthStatus, logout } from "@/service/auth";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ["/", "/login", "/register"];
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      try {
        const isAuth = await checkAuthStatus();
        setIsAuthenticated(isAuth);

        if (
          !isAuth &&
          !publicRoutes.includes(pathname) &&
          !pathname.startsWith("/_next")
        ) {
          toast.info("Please log in to access this page");
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        setIsAuthenticated(false);

        if (!publicRoutes.includes(pathname)) {
          toast.error(
            "Authentication verification failed. Please log in again."
          );
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      toast.success("Successfully logged out");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
