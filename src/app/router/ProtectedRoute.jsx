import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const ProtectedRoute = () => {
  const { userLoggedIn } = useAuth();

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const hide = location.pathname.startsWith("/survey/fill-survey");

  return (
    <>
        {!hide && <Navbar/>}
        <Outlet/>
        {!hide && <Footer/>}

    </>
  );
};

export default ProtectedRoute;
