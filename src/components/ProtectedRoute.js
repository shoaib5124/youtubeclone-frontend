import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen"; // adjust path

const ProtectedRoute = () => {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setTimeout(() => {
      setIsAuth(!!token);
      setChecking(false);
    }, 400); // short delay to allow smooth transition
  }, []);

  if (checking) return <LoadingScreen />;

  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
