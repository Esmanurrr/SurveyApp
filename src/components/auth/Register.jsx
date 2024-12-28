import React, { useState } from "react";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { FormWrapper, Input, InputWrapper, LoginDiv } from "../../style";
import { registerValidationSchema } from "../../validations/schemas/userSchema";

const firebaseErrorMessages = {
  "auth/email-already-in-use": "This email is already registered.",
  "auth/invalid-email": "The email address is not valid.",
  "auth/network-request-failed":
    "Network error. Please check your internet connection.",
  "auth/internal-error":
    "An internal server error occurred. Please try again later.",
  default: "An error occurred. Please try again later.",
};

function Register() {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await registerValidationSchema.validate(
        { email, password, confirmPassword },
        { abortEarly: false }
      );

      if (!isRegistering) {
        setIsRegistering(true);
        await doCreateUserWithEmailAndPassword(email, password);
        setIsRegistering(false);
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const formattedErrors = {};
        error.inner.forEach((err) => {
          formattedErrors[err.path] = err.message;
        });
        setErrors(formattedErrors);
      } else if (error.code) {
        setErrors({
          general:
            firebaseErrorMessages[error.code] || firebaseErrorMessages.default,
        });
      }
      setIsRegistering(false);
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
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password}</p>
            )}
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
            {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword}</p>}
          </InputWrapper>
          {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
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
