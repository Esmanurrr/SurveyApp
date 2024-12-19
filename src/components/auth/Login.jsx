import React, { useState } from "react";
import { doSignInWithEmailAndPassword } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { Link, Navigate } from "react-router-dom";
import {
  BaseBackground,
  BaseWrapper,
  Container,
  FormWrapper,
  Input,
  InputWrapper,
  LoginDiv,
} from "../../style";

function Login() {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      await doSignInWithEmailAndPassword(email, password);
      setIsSigningIn(false);
    }
  };

  if (userLoggedIn) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <FormWrapper>
      <LoginDiv>
        <h1>Welcome Back!</h1>
        <form onSubmit={handleLogin}>
          <InputWrapper>
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputWrapper>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to={"/register"}>Register</Link>
        </p>
      </LoginDiv>
    </FormWrapper>
  );
}

export default Login;
