import * as yup from 'yup';

export const surveySchema = yup.object().shape({
    title: yup
        .string()
        .required("Survey name is required")
        .min(3, "Survey name must be at least 3 characters"),
    description: yup.string().max(100, "Description can not exceed 100 characters")
})