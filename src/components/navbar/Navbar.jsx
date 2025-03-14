import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavbarWrapper } from "../../style";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  return (
    <NavbarWrapper>
        <ul>
          <li>
            <Link to="/">Surveys</Link>
          </li>
          <li>
            <Link to="/responses">Responses</Link>
          </li>
        </ul>
        <>
          {userLoggedIn ? (
            <div
            style={{cursor:"pointer"}}
              onClick={() => {
                doSignOut().then(() => {
                  navigate("/login");
                  toast.success("Logged Out! See you soon!", {position: "top-right"})
                });
              }}
            >
              Logout
            </div>
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
