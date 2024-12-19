import React, { useState } from "react";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const { userLoggedIn } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      await doCreateUserWithEmailAndPassword(email, password);
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/"} replace={true} />}

      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <label>Confirm Password</label>
          <input
            disabled={isRegistering}
            type="password"
            autoComplete="off"
            required
            value={confirmPassword}
            onChange={(e) => {
              setconfirmPassword(e.target.value);
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isRegistering}
        >
          {isRegistering ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </>
  );
}

export default Register;
