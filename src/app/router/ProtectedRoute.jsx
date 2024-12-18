import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Navbar from "../../components/navbar/Navbar";

const ProtectedRoute = () => {
  const { userLoggedIn } = useAuth();

  console.log("ProtectedRoute - userLoggedIn:", userLoggedIn);

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
        <Navbar/>
        <Outlet/>
    </>
  );
};

export default ProtectedRoute;
