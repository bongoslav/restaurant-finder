import { createContext, useState, useEffect, useCallback } from "react";
import {
  AuthContextType,
  ContextProviderProps,
  SignupData,
  SignupResponse,
  User,
} from "../types/AuthContext";
import API_URL from "../util/apiUrl";

const initialValue: AuthContextType = {
  user: null,
  login: async () => {},
  logout: async () => {},
  signup: async () => {
    // throw the error if someone tries to use the signup function
    // before the real implementation is provided by the AuthProvider
    throw new Error("Signup function not implemented");
  },
  isAuthenticated: false,
  getTokenFromStorage: () => {}
};

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

export const AuthContext = createContext<AuthContextType>(initialValue);

const AuthProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuthHeader = useCallback((token: string | null): HeadersInit => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }, []);

  const getTokenFromStorage = useCallback(() => {
    return sessionStorage.getItem("accessToken");
  }, []);

  const setTokenInStorage = useCallback((token: string) => {
    const encryptedToken = token;
    sessionStorage.setItem("accessToken", encryptedToken);
  }, []);

  const removeTokenFromStorage = useCallback(() => {
    sessionStorage.removeItem("accessToken");
  }, []);

  const isTokenExpiringSoon = useCallback((token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000; // convert to milliseconds
      return expirationTime - Date.now() < TOKEN_REFRESH_THRESHOLD;
    } catch (error) {
      console.error("Error parsing token:", error);
      return true; // assume token is expiring if we can't parse it
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success" && data.data.accessToken) {
          setTokenInStorage(data.data.accessToken);
          return data.data.accessToken;
        }
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
    return null;
  }, [setTokenInStorage]);

  const checkAndRefreshTokenIfNeeded = useCallback(async () => {
    const token = getTokenFromStorage();
    if (token && isTokenExpiringSoon(token)) {
      const newToken = await refreshToken();
      if (newToken) {
        setTokenInStorage(newToken);
        return newToken;
      }
    }
    return token;
  }, [
    getTokenFromStorage,
    isTokenExpiringSoon,
    refreshToken,
    setTokenInStorage,
  ]);

  const checkAuth = useCallback(async () => {
    const token = await checkAndRefreshTokenIfNeeded();
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/me`, {
        method: "GET",
        headers: setAuthHeader(token),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success" && data.data.user) {
          setUser(data.data.user);
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid user data");
        }
      } else {
        throw new Error("Auth check failed");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      removeTokenFromStorage();
    }
  }, [checkAndRefreshTokenIfNeeded, setAuthHeader, removeTokenFromStorage]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: setAuthHeader(null),
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (
          data.status === "success" &&
          data.data.user &&
          data.data.accessToken
        ) {
          setUser(data.data.user);
          setTokenInStorage(data.data.accessToken);
          setIsAuthenticated(true);
          window.location.reload();
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = getTokenFromStorage();
      const response = await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: setAuthHeader(token),
        credentials: "include",
      });
      if (response.ok) {
        setUser(null);
        setIsAuthenticated(true);
        removeTokenFromStorage();
        window.location.reload();
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const signup = async (signupData: SignupData) => {
    try {
      console.log({ signupData });

      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: setAuthHeader(null),
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        const data: SignupResponse = await response.json();
        return data.data.user;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    signup,
    isAuthenticated,
    getTokenFromStorage
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
