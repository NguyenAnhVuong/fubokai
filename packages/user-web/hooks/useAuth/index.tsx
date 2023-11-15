import { createContext } from "react";
import { useContext } from "react";
import { useCallback } from "react";
import { useState } from "react";

type AuthContextType = {
  userId: string | null;
  token: string | null;
  usingCartId: string | null;
  updateUsingCartId: (cartId: string | null) => void;
  updateToken: (userId: string | null, token: string | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  token: null,
  usingCartId: null,
  updateUsingCartId: () => {},
  updateToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState(typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const [userId, setUserId] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("userId") : null,
  );
  const [usingCartId, setUsingCartId] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("usingCartId") : null,
  );

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

  const updateUsingCartId = useCallback((cartId: string | null) => {
    if (cartId) {
      localStorage.setItem("usingCartId", cartId);
    } else {
      localStorage.removeItem("usingCartId");
    }
    setUsingCartId(cartId);
  }, []);

  return (
    <AuthContext.Provider value={{ userId, token, usingCartId, updateUsingCartId, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};
