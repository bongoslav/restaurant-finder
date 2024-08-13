import { createContext, ReactNode } from "react";

export interface SignupData {
  email: string;
  username: string;
  name: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (signupData: SignupData) => Promise<User>;
  isAuthenticated: boolean;
  getTokenFromStorage: () => void;
}

export interface ContextProviderProps {
  children: ReactNode;
}

export interface LoginResponse {
  data: {
    user: User;
    accessToken: string;
  };
}

// some TS magic to omit `accessToken` from the Login response
type ChangeFields<T, R> = Omit<T, keyof R> & R;
export type CurrentUserResponse = ChangeFields<
  LoginResponse,
  { data: Omit<LoginResponse["data"], "accessToken"> }
>;

export type SignupResponse = ChangeFields<
  LoginResponse,
  { data: Omit<LoginResponse["data"], "accessToken"> }
>;

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
