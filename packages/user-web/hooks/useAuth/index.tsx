import { createContext } from "react";
import { useContext } from "react";
import { useCallback } from "react";
import { useState } from "react";

type AuthContextType = {
  userId: string | null;
  token: string | null;
  updateToken: (userId: string | null, token: string | null) => void;
};

const AuthContext = createContext<AuthContextType>({ userId: null, token: null, updateToken: () => {} });

export const useAuth = () => useContext(AuthContext);

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState(typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const [userId, setUserId] = useState<string | null>(typeof window !== "undefined" ? localStorage.getItem("userId") : null);

  const updateToken = useCallback((id: string | null, token: string | null) => {
    if (token) {
      localStorage.setItem("userId", id ?? "");
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    }
    setUserId(id);
    setToken(token);
  }, []);

  return <AuthContext.Provider value={{ userId, token, updateToken }}>{children}</AuthContext.Provider>;
};
