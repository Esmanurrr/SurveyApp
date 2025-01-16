import { useState } from "react";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import {
  FormWrapper,
  LoginDiv,
  InputWrapper,
  Input,
  AuthSubmitButton,
} from "../../style.jsx";
import {
  registerErrorMessages,
  registerValidationSchema,
} from "../../validations/schemas/userSchema";
import { toast } from "react-toastify";

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
        toast.success("Signed up!", { position: "top-right" });
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
            registerErrorMessages[error.code] || registerErrorMessages.default,
        });
        toast.error("Cannot signing up.", { position: "top-right" });
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
            {errors.confirmPassword && (
              <p style={{ color: "red" }}>{errors.confirmPassword}</p>
            )}
          </InputWrapper>
          {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
          <AuthSubmitButton type="submit" disabled={isRegistering}>
            {isRegistering ? "Signing Up..." : "Sign Up"}
          </AuthSubmitButton>
          <p>
            Do you have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </LoginDiv>
    </FormWrapper>
  );
}

export default Register;
