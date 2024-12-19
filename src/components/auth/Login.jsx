import React, { useState } from "react";
import { doSignInWithEmailAndPassword } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { Link, Navigate } from "react-router-dom";

function Login() {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      await doSignInWithEmailAndPassword(email, password);
      setIsSigningIn(false);
    }
  };


  if (userLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {userLoggedIn && <Navigate to={"/"} replace={true} />}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
        <p>Dont u have an account? <Link to={'/register'}>Register</Link></p>
      </form>
    </>
  );
}

export default Login;
