import * as yup from 'yup';

export const surveySchema = yup.object().shape({
    title: yup
        .string()
        .required("Survey name is required")
        .min(3, "Survey name must be at least 3 characters"),
    description: yup.string().max(100, "Description can not exceed 100 characters")
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
      // Zorunlu bir soru için en az bir seçeneğin seçilmesini zorunlu kıl
      validator = validator.min(
        1,
        `${question.name} requires at least one option to be selected`
      );
    } else {
      // Geçilebilir soru için nullable olmasına izin ver
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