import {
  createContext,
  useEffect,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import { fetchApi } from "@/services/api";

import type { UserApiGoogleLogin200, UserApiGetMe200 } from "@/gen/types";

interface AuthContextType {
  isAuthenticate: boolean;
  setIsAuthenticate: Dispatch<SetStateAction<boolean>>;
  user: UserApiGoogleLogin200 | null;
  setUser: Dispatch<SetStateAction<UserApiGoogleLogin200 | null>>;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const [user, setUser] = useState<UserApiGoogleLogin200 | null>(null);

  const handleLogin = () => {
    // need to be implement
  };

  const handleLogout = () => {
    setIsAuthenticate(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticate,
        setIsAuthenticate,
        user,
        setUser,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
