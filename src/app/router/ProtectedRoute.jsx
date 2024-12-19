import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Navbar from "../../components/navbar/Navbar";

const ProtectedRoute = () => {
  const { userLoggedIn } = useAuth();

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const hideNavbar = location.pathname.startsWith("/survey/fill-survey");

  return (
    <>
        {!hideNavbar && <Navbar/>}
        <Outlet/>
    </>
  );
};

export default ProtectedRoute;
