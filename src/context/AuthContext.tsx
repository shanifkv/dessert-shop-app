/**
 * src/context/AuthContext.tsx
 * Simple typed AuthContext skeleton for Day 1.
 */
import React, { createContext, useContext, useState, ReactNode } from "react";

// AppUser type: role is one of three literal strings
export interface AppUser {
  uid: string;
  email?: string;
  role: "customer" | "shop" | "delivery";
}

interface AuthContextType {
  user: AppUser | null;
  signInAs: (role: AppUser["role"]) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  const signInAs = (role: AppUser["role"]) => {
    setUser({
      uid: "fake-uid",
      email: `${role}@example.com`,
      role,
    });
  };

  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signInAs, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
