import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavbarWrapper } from "../../style";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";

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
        {userLoggedIn ? (
          <>
            <button
              onClick={() => {
                doSignOut().then(() => {
                  navigate("/login");
                });
              }}
              className="text-sm text-blue-600 underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to={"/login"}>
              Login
            </Link>
            <Link to={"/register"}>
              Register New Account
            </Link>
          </>
        )}
      </ul>
    </NavbarWrapper>
  );
};

export default Navbar;
