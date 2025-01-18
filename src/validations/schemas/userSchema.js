import * as yup from "yup";

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid e-mail")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const registerValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid e-mail")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
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
