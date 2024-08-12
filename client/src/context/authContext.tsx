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
  accessToken: null,
  login: async () => {},
  logout: async () => {},
  signup: async () => {
    // throw the error if someone tries to use the signup function
    // before the real implementation is provided by the AuthProvider
    throw new Error("Signup function not implemented");
  },
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextType>(initialValue);

const AuthProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  // to prevent regenerating token upon logging out
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const setAuthHeader = useCallback((token: string | null): HeadersInit => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }, []);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    if (isLoggedOut) return null;

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success" && data.data.accessToken) {
          return data.data.accessToken;
        }
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
    return null;
  }, [isLoggedOut]);

  const checkAuth = useCallback(async () => {
    if (isLoggedOut) return;

    let token = accessToken;
    if (!token) {
      token = await refreshToken();
      if (!token) {
        setUser(null);
        setAccessToken(null);
        return;
      }
      setAccessToken(token);
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
        } else {
          setUser(null);
          setAccessToken(null);
        }
      } else if (response.status === 401) {
        // token might be expired, try refreshing
        const newToken = await refreshToken();
        if (newToken) {
          setAccessToken(newToken);
          await checkAuth(); // retry with new token
        } else {
          setUser(null);
          setAccessToken(null);
        }
      } else {
        setUser(null);
        setAccessToken(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setAccessToken(null);
    }
  }, [accessToken, setAuthHeader, refreshToken, isLoggedOut]);

  useEffect(() => {
    if (!isLoggedOut) {
      checkAuth();
    }
  }, [checkAuth, isLoggedOut]);

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
          setAccessToken(data.data.accessToken);
          setIsLoggedOut(false);
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
      const response = await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: setAuthHeader(accessToken),
        credentials: "include",
      });
      if (response.ok) {
        setUser(null);
        setAccessToken(null);
        setIsLoggedOut(true);
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
    accessToken,
    login,
    logout,
    signup,
    isAuthenticated: user !== null && accessToken !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
