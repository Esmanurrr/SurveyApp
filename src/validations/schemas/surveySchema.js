import * as yup from 'yup';

export const surveySchema = yup.object().shape({
    title: yup
        .string()
        .required("Survey name is required")
        .min(3, "Survey name must be at least 3 characters"),
    description: yup.string().max(100, "Description can not exceed 100 characters")
});

export const questionSchema = yup.object().shape({
  name: yup.string().required("Question name is required"),
  type: yup
    .string()
    .required("Question type is required")
    .oneOf(
      ["Single Choice", "Multiple Choice", "Text Response", "Long Text Response"],
      "Select a valid question type"
    ),
  options: yup
    .array()
    .of(yup.string().trim().required("Option can not be empty"))
    .when("type", {
      is: (type) => type === "Single Choice" || type === "Multiple Choice",
      then: (schema) =>
        schema
          .min(1, "At least one option must be filled in")
          .required("Options are required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  responseType: yup.string().nullable().required("Please select a response type"),
  canBeSkipped: yup.boolean(),
});




const textResponseValidator = (question) => {
    let validator = yup.string();
  
    if (!question.canBeSkipped) {
      validator = validator.required("This is a required question");
    }
  
    if (question.responseType === "Email") {
      validator = validator.email(`${question.name} must be a valid email address`);
    }
  
    return validator;
  };
  
  const multipleChoiceValidator = (question) => {
    let validator = yup.array().of(yup.string().required("Option cannot be empty"));
  
    if (!question.canBeSkipped) {
      validator = validator.min(
        1,
        `${question.name} requires at least one option to be selected`
      );
    } else {
      validator = validator.nullable();
    }
  
    return validator;
  };
  
  
  const defaultValidator = (question) => {
    let validator = yup.string();
  
    if (!question.canBeSkipped) {
      validator = validator.required("This is a required question");
    } else {
      validator = validator.nullable();
    }
  
    return validator;
  };
  

export const createValidationSchema = (questions) => {
    const shape = {};

    questions.forEach((question) => {
        switch (question.type) {
          case "Text Response":
            shape[question.id] = textResponseValidator(question);
            break;
          case "Multiple Choice":
            shape[question.id] = multipleChoiceValidator(question);
            break;
          default:
            shape[question.id] = defaultValidator(question);
            break;
        }
      });

    return yup.object().shape(shape);
};