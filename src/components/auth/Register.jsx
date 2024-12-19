import React, { useState } from "react";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { FormWrapper, Input, InputWrapper, LoginDiv } from "../../style";

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

  if (userLoggedIn) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <FormWrapper>
      <LoginDiv>
        <h1>Welcome!</h1>
        <form onSubmit={handleRegister}>
          <InputWrapper>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
              <Input
                disabled={isRegistering}
                type="password"
                placeholder="Confirm Password"
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setconfirmPassword(e.target.value);
                }}
              />
          </InputWrapper>
          <button type="submit" disabled={isRegistering}>
            {isRegistering ? "Signing Up..." : "Sign Up"}
          </button>
          <p>
            Do you have an account? <Link to={"/login"}>Login</Link>
          </p>
        </form>
      </LoginDiv>
    </FormWrapper>
  );
}

export default Register;
