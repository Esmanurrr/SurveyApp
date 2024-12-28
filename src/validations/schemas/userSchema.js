import * as yup from 'yup';



export const loginValidationSchema = yup.object().shape({
    email: yup.string()
      .email("Enter a valid e-mail")
      .required("Email is required"),
    password: yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });