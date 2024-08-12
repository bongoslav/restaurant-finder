import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { AuthContextType } from "../types/AuthContext";

export const useAuth = () => {
  const context = useContext<AuthContextType>(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
