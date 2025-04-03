import * as yup from "yup";
import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";

// Password validation regex
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Email existence check
const checkEmailExists = async (email) => {
  try {
    const auth = getAuth();
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    return signInMethods.length > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid e-mail")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
});

export const registerValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid e-mail")
    .required("Email is required")
    .test(
      "email-exists",
      "This email is already registered",
      async function (value) {
        if (!value) return true;
        return !(await checkEmailExists(value));
      }
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export const registerErrorMessages = {
  "auth/email-already-in-use": "This email is already registered.",
  "auth/invalid-email": "The email address is not valid.",
  "auth/network-request-failed":
    "Network error. Please check your internet connection.",
  "auth/internal-error":
    "An internal server error occurred. Please try again later.",
  default: "An error occurred. Please try again later.",
};

export const loginErrorMessages = {
  "auth/invalid-credential":
    "The email address or password is incorrect. Please try again.",
  "auth/too-many-requests": "Too many login attempts. Please try again later.",
  "auth/network-request-failed":
    "Network error. Please check your internet connection.",
  "auth/internal-error":
    "An internal server error occurred. Please try again later.",
  "auth/user-not-found": "No user found with this email address.",
  default: "An error occured. Please try again later.",
};
