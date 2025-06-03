import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance, { setLogoutHandler } from "../api/axiosInstance";

interface UserType {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  contact: string;
  role: string;
  profile: any;
}
interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  login: () => void; // login just triggers refresh
  logout: () => void;
  refreshUser: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = () => {
    setLoading(true);
    axiosInstance
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (err.response?.status === 401) setUser(null);
      })
      .finally(() => setLoading(false));
  };

  const logout = () => {
    axiosInstance.post("/auth/logout").finally(() => {
      setUser(null);
      window.location.href = "/login";
    });
  };

  useEffect(() => setLogoutHandler(() => logout), []);
  useEffect(() => { refreshUser(); }, []);

  // Login: just trigger user refresh (cookie is set by backend)
  const login = () => refreshUser();

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
