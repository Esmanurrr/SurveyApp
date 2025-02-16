import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BaseWrapper,
  Container,
  Question,
  ShortDropdown,
  ShortInput,
  ShortTextarea,
  SubmitButton,
  SurveyDef,
  SurveyWrapper,
} from "../../style";
import { createValidationSchema } from "../../validations/schemas/surveySchema";
import * as yup from "yup";
import SurveyComplete from "../infos/SurveyComplete";
import LoadingPage from "../infos/LoadingPage";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createResponseAsync } from "../../redux/response/responseSlice";
import { fetchSurveyByIdAsync } from "../../redux/survey/surveySlice";

const FillSurvey = () => {
  const { surveyId } = useParams();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();
  const { currentSurvey: survey, loading } = useSelector(
    (state) => state.survey
  );

  useEffect(() => {
    if (surveyId) {
      dispatch(fetchSurveyByIdAsync(surveyId))
        .unwrap()
        .then((surveyData) => {
          const initialFormData = {};
          surveyData.questions.forEach((question) => {
            if (question.type === "Multiple Choice") {
              initialFormData[question.id] = [];
            } else {
              initialFormData[question.id] = "";
            }
          });
          setFormData(initialFormData);
        })
        .catch((error) => {
          toast.error(error || "Failed to fetch survey data", {
            position: "top-right",
          });
        });
    }
  }, [dispatch, surveyId]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!survey || !survey.questions) {
    return (
      <Container>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <h2>Survey not found or has no questions.</h2>
          <p>
            The survey might have been deleted or the link might be invalid.
          </p>
        </div>
      </Container>
    );
  }

  const handleResponseChange = (questionId, value) => {
    setFormData({
      ...formData,
      [questionId]: value,
    });
  };

  const getAnswer = (question, formData) => {
    const response = formData[question.id];

    if (Array.isArray(response)) {
      if (response.length === 0 && !question.canBeSkipped) {
        throw new Error(
          `${question.name} requires at least one option to be selected.`
        );
      }
      return response;
    }

    if (response !== undefined && response !== null) {
      return response;
    }

    return question.canBeSkipped ? "Unanswered" : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationSchema = createValidationSchema(survey.questions);

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setError({});

      const generateResponderId = () => {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const formattedResponses = {
        title: survey.title,
        questions: survey.questions.map((question) => ({
          id: question.id,
          name: question.name,
          answer: getAnswer(question, formData),
          canBeSkipped: question.canBeSkipped || false,
        })),
      };

      const responseData = {
        surveyId: surveyId,
        surveyOwnerId: survey.userId,
        responderId: generateResponderId(),
        createdAt: new Date().toISOString(),
        ...formattedResponses,
      };

      await dispatch(createResponseAsync(responseData)).unwrap();
      toast.success("Thank you for completing the survey!", {
        position: "top-right",
      });
      setIsSubmitted(true);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setError(newErrors);
      } else {
        toast.error("Failed to submit responses. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <SurveyWrapper>
      <SurveyDef>
        <h1>{survey.title}</h1>
        <p>{survey.description}</p>
      </SurveyDef>
      <BaseWrapper>
        <Container>
          {isSubmitted ? (
            <SurveyComplete />
          ) : (
            <form onSubmit={handleSubmit}>
              {survey.questions.map((question, index) => (
                <div key={question.id}>
                  <Question>
                    {index + 1}. {question.name}
                    {error[question.id] && (
                      <div style={{ color: "red", fontSize: "12px" }}>
                        {error[question.id]}
                      </div>
                    )}
                  </Question>
                  {question.type === "Single Choice" && (
                    <ShortDropdown
                      value={formData[question.id] || ""}
                      onChange={(e) =>
                        handleResponseChange(question.id, e.target.value)
                      }
                    >
                      <option value="">Select an option</option>
                      {question.options
                        .filter((option) => option !== "")
                        .map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                    </ShortDropdown>
                  )}

                  {question.type === "Multiple Choice" && (
                    <div>
                      {question.options
                        .filter((option) => option !== "")
                        .map((option) => (
                          <label key={option}>
                            <input
                              type="checkbox"
                              value={option}
                              checked={
                                formData[question.id]?.includes(option) || false
                              }
                              style={{ margin: "5px" }}
                              onChange={(e) => {
                                const selectedOptions =
                                  formData[question.id] || [];
                                if (e.target.checked) {
                                  handleResponseChange(question.id, [
                                    ...selectedOptions,
                                    option,
                                  ]);
                                } else {
                                  handleResponseChange(
                                    question.id,
                                    selectedOptions.filter((v) => v !== option)
                                  );
                                }
                              }}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                    </div>
                  )}

                  {question.type === "Text Response" && (
                    <ShortInput
                      type="text"
                      placeholder="Enter your answer"
                      value={formData[question.id] || ""}
                      onChange={(e) =>
                        handleResponseChange(question.id, e.target.value)
                      }
                    />
                  )}

                  {question.type === "Long Text Response" && (
                    <ShortTextarea
                      rows={4}
                      placeholder="Write your answer"
                      value={formData[question.id] || ""}
                      onChange={(e) =>
                        handleResponseChange(question.id, e.target.value)
                      }
                    />
                  )}
                </div>
              ))}

              <SubmitButton type="submit">Submit</SubmitButton>
            </form>
          )}
        </Container>
      </BaseWrapper>
    </SurveyWrapper>
  );
};

export default FillSurvey;
