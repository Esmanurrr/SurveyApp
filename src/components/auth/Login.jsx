import React, { useState } from "react";
import { doSignInWithEmailAndPassword } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { Link, Navigate } from "react-router-dom";
import { FormWrapper, Input, InputWrapper, LoginDiv } from "../../style";
import { loginErrorMessages, loginValidationSchema } from "../../validations/schemas/userSchema";
import { toast } from "react-toastify";


function Login() {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errors, setErrors] = useState({});

  

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await loginValidationSchema.validate({ email, password }, { abortEarly: false });

      setIsSigningIn(true);
      await doSignInWithEmailAndPassword(email, password);
      toast.success("Logged in!", { position: "top-right"});
      
      setIsSigningIn(false);
    } catch (error) {
      if (error.name === "ValidationError") {
        const formattedErrors = {};
        error.inner.forEach((err) => {
          formattedErrors[err.path] = err.message;
        });
        setErrors(formattedErrors);
      } else if (error.code) {
        console.log(error, error.code);
        toast.error("Unable to log in. Please check your username and password.", { position: "top-right"});
        setErrors({ general: loginErrorMessages[error.code] || loginErrorMessages.default });
      }
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
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
          </InputWrapper>
          {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
          <button type="submit" disabled={isSigningIn}>
            {isSigningIn ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account? <Link to={"/register"}>Register</Link>
        </p>
      </LoginDiv>
    </FormWrapper>
  );
}

export default Login;
