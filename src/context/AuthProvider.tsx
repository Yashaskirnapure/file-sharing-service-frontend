import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./authContext";
import type { AuthContextType, User, JWTPayload } from "./authContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      try {
        const decoded: JWTPayload = jwtDecode<JWTPayload>(savedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(savedToken);
          setUser({
            id: decoded.userId,
            name: decoded.name,
            email: decoded.email,
          });
        } else {
          localStorage.removeItem("accessToken");
        }
      } catch {
        localStorage.removeItem("accessToken");
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("accessToken", newToken);
    const decoded: JWTPayload = jwtDecode<JWTPayload>(newToken);
    setToken(newToken);
    setUser({
      id: decoded.userId,
      name: decoded.name,
      email: decoded.email,
    });
    navigate("/dashboard");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <div>Loading...</div>
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
