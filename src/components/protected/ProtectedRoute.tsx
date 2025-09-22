import { useAuth } from "@/context/useAuth";
import { Navigate } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { token } = useAuth();
	if (!token) { return <Navigate to="/" replace />; }
	return children;
};

export default ProtectedRoute