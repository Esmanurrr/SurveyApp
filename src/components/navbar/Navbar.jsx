import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavbarWrapper } from "../../style";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import { toast } from "react-toastify";
import logo from "../../../public/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  return (
    <NavbarWrapper>
      <ul style={{ display: "flex", alignItems: "center" }}>
        <li>
          <Link to="/">
            <img
              style={{ width: "50px", height: "50px" }}
              src={logo}
              alt="logo"
            />
          </Link>
        </li>
        <li>
          <Link style={{ fontSize: "1.2rem" }} to="/">
            Surveys
          </Link>
        </li>
        <li>
          <Link style={{ fontSize: "1.2rem" }} to="/responses">
            Responses
          </Link>
        </li>
      </ul>
      <>
        {userLoggedIn ? (
          <Link
            style={{ fontSize: "1.2rem" }}
            onClick={() => {
              doSignOut().then(() => {
                navigate("/login");
                toast.success("Logged Out! See you soon!", {
                  position: "top-right",
                });
              });
            }}
          >
            Logout
          </Link>
        ) : (
          <div>
            <Link to={"/login"}>Login</Link>
            <Link to={"/register"}>Register New Account</Link>
          </div>
        )}
      </>
    </NavbarWrapper>
  );
};

export default Navbar;
