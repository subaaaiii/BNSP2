import React, { createContext } from "react";
import type { ReactNode } from "react";
import { useMe } from "../hooks/auth/useMe";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  picture: string;
  email_verified: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: user, isLoading } = useMe();
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user: user || null, loading: isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
