import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";
import Api from "../services/api";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!Cookies.get("token")
  );

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ambil data user dari endpoint /me
  const fetchMe = async () => {
  try {
    const token = Cookies.get("token");

    const res = await Api.get("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUser(res.data.data);
    setIsAuthenticated(true);
  } catch (error) {
    setUser(null);
    setIsAuthenticated(false);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (Cookies.get("token")) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};