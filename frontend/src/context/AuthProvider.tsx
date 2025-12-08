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
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const [user, setUser] = useState<UserApiGoogleLogin200 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getMe() {
      setIsLoading(true);
      const { data, error } = await fetchApi<UserApiGetMe200>(
        "/users/get-me/",
        "GET"
      );

      if (data) {
        setIsAuthenticate(true);
        setUser(data);
      }
      if (error) {
        setIsAuthenticate(false);
        setUser(null);
        setError(error);
      }
      setIsLoading(false);
    }
    getMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticate,
        setIsAuthenticate,
        user,
        setUser,
        isLoading,
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
