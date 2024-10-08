import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();

  if (currentUser === null) return <Navigate to="/login" />;

  return <>{children}</>;
};

export default ProtectedRoute;
