import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavbarWrapper, MobileMenu, HamburgerButton } from "../../style";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import { toast } from "react-toastify";
import logo from "../../../public/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    doSignOut().then(() => {
      navigate("/login");
      toast.success("Logged Out! See you soon!", {
        position: "top-right",
      });
    });
    setIsOpen(false);
  };

  return (
    <NavbarWrapper>
      <div className="nav-brand">
        <Link to="/">
          <img
            style={{ width: "50px", height: "50px" }}
            src={logo}
            alt="logo"
          />
        </Link>
      </div>

      <MobileMenu isOpen={isOpen}>
        <ul>
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              Surveys
            </Link>
          </li>
          <li>
            <Link to="/responses" onClick={() => setIsOpen(false)}>
              Responses
            </Link>
          </li>
        </ul>
        <div className="auth-buttons">
          {userLoggedIn ? (
            <Link onClick={handleLogout}>Logout</Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </MobileMenu>
      <HamburgerButton onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </HamburgerButton>
    </NavbarWrapper>
  );
};

export default Navbar;
