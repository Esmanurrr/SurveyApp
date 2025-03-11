import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuestionAsync,
  fetchQuestionsAsync,
  updateQuestionAsync,
  setCurrentQuestion,
  updateCurrentQuestion,
} from "../../redux/question/questionSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  BaseBackground,
  Button,
  CardContainer,
  CardWrapper,
  Container,
  Dropdown,
  DropdownWrapper,
  Flex,
  InputRes,
  LabelDiv,
} from "../../style";
import { toast } from "react-toastify";
import Choices from "../options/Choices";
import InputResponse from "../options/InputResponse";
import LoadingPage from "../infos/LoadingPage";
import { questionSchema } from "../../validations/schemas/surveySchema";
import * as yup from "yup";

function QuestionForm({ isEdit, surveyId }) {
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { questionId } = useParams();
  const { currentQuestion, loading } = useSelector((state) => state.question);

  useEffect(() => {
    const fetchQuestionData = async () => {
      if (isEdit && questionId) {
        try {
          const result = await dispatch(fetchQuestionsAsync(surveyId)).unwrap();
          const question = result.find((q) => q.id === questionId);
          if (question) {
            dispatch(
              setCurrentQuestion({
                name: question.name || "",
                type: question.type || "",
                options: question.options || [],
                responseType: question.responseType || "Text",
                canBeSkipped:
                  question.canBeSkipped !== undefined
                    ? question.canBeSkipped
                    : true,
              })
            );
          }
        } catch (error) {
          toast.error("Failed to fetch question data", {
            position: "top-right",
          });
        }
      } else {
        dispatch(
          setCurrentQuestion({
            name: "",
            type: "",
            options: [],
            responseType: "Text",
            canBeSkipped: false,
          })
        );
      }
    };

    fetchQuestionData();

    return () => {
      dispatch(setCurrentQuestion(null));
    };
  }, [isEdit, questionId, surveyId, dispatch]);

  const validateField = (name, value) => {
    try {
      const schema = yup.reach(questionSchema, name);
      schema.validateSync(value);
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    } catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: err.message,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      const updatedQuestion = {
        ...currentQuestion,
        type: value,
        responseType:
          value === "Text Response" ? "Text" : currentQuestion.responseType,
        options:
          value === "Single Choice" || value === "Multiple Choice"
            ? currentQuestion.options
            : [],
      };
      dispatch(updateCurrentQuestion(updatedQuestion));

      try {
        const schema = yup.reach(questionSchema, "type");
        schema.validateSync(value);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.type;
          if (!(value === "Single Choice" || value === "Multiple Choice")) {
            delete newErrors.options;
          }
          return newErrors;
        });
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          type: err.message,
        }));
      }
    } else {
      const newValue = name === "canBeSkipped" ? value === "true" : value;
      dispatch(
        updateCurrentQuestion({
          ...currentQuestion,
          [name]: newValue,
        })
      );
      validateField(name, newValue);
    }
  };

  const handleOptionsChange = (newOptions) => {
    dispatch(
      updateCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
      })
    );
  };

  const setInputType = (inputType) => {
    dispatch(
      updateCurrentQuestion({
        ...currentQuestion,
        responseType: inputType,
      })
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const filteredOptions = currentQuestion.options.filter(
      (option) => option && option.trim().length > 0
    );

    const dataToValidate = {
      ...currentQuestion,
      options: filteredOptions,
    };

    try {
      await questionSchema.validate(dataToValidate, { abortEarly: false });

      if (isEdit) {
        await dispatch(
          updateQuestionAsync({
            surveyId,
            updatedQuestion: {
              ...currentQuestion,
              id: questionId,
              options: filteredOptions,
            },
          })
        ).unwrap();

        toast.success("Question updated successfully", {
          position: "top-right",
        });
        navigate(`/survey/${surveyId}`);
      } else {
        await dispatch(
          addQuestionAsync({
            surveyId,
            newQuestion: { ...currentQuestion, options: filteredOptions },
          })
        ).unwrap();

        toast.success("Question added successfully", {
          position: "top-right",
        });
        navigate(`/survey/${surveyId}`);
      }
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        const newErrors = {};
        validationError.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
        toast.error("Please check all required fields!", {
          position: "top-right",
        });
      } else {
        toast.error("An error occurred while saving", {
          position: "top-right",
        });
      }
    }
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "Single Choice":
      case "Multiple Choice":
        return (
          <>
            <LabelDiv>Options</LabelDiv>
            <Choices
              options={currentQuestion.options}
              setOptions={handleOptionsChange}
            />
            {errors.options && (
              <p style={{ color: "red", margin: "5px 0" }}>{errors.options}</p>
            )}
          </>
        );
      case "Text Response":
        return (
          <>
            <InputResponse
              inputType={currentQuestion.responseType}
              setInputType={setInputType}
            />
            {errors.responseType && (
              <p style={{ color: "red", margin: "5px 0" }}>
                {errors.responseType}
              </p>
            )}
          </>
        );
      case "Long Text Response":
        return (
          <>
            <InputRes type="text" placeholder="Enter your response" />
            {errors.responseType && (
              <p style={{ color: "red", margin: "5px 0" }}>
                {errors.responseType}
              </p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  if (loading || !currentQuestion) return <LoadingPage />;

  return (
    <BaseBackground>
      <Container>
        <CardWrapper>
          <CardContainer>
            <form onSubmit={handleSave}>
              <div>
                <LabelDiv>Question Name</LabelDiv>
                <InputRes
                  type="text"
                  name="name"
                  value={currentQuestion.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p style={{ color: "red", margin: "5px 0" }}>{errors.name}</p>
                )}
              </div>
              <Flex>
                <DropdownWrapper>
                  <LabelDiv>Question Type</LabelDiv>
                  <Dropdown
                    name="type"
                    value={currentQuestion.type}
                    onChange={handleChange}
                    disabled={isEdit}
                  >
                    <option value="">Choose a question type</option>
                    <option value="Single Choice">Single Choice</option>
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Text Response">Text Response</option>
                    <option value="Long Text Response">
                      Long Text Response
                    </option>
                  </Dropdown>
                  {errors.type && (
                    <p style={{ color: "red", margin: "5px 0" }}>
                      {errors.type}
                    </p>
                  )}
                </DropdownWrapper>
                <DropdownWrapper>
                  <LabelDiv>Can be skipped?</LabelDiv>
                  <Dropdown
                    name="canBeSkipped"
                    value={String(currentQuestion.canBeSkipped)}
                    onChange={handleChange}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Dropdown>
                  {errors.canBeSkipped && (
                    <p style={{ color: "red", margin: "5px 0" }}>
                      {errors.canBeSkipped}
                    </p>
                  )}
                </DropdownWrapper>
              </Flex>
              {currentQuestion.type && (
                <>
                  <LabelDiv>Preview</LabelDiv>
                  <div
                    style={{
                      border: "1px solid #ddd",
                      boxShadow: "0 10px 10px 0 rgba(0, 0, 0, 0.1)",
                      padding: "10px",
                      borderRadius: "10px",
                      marginTop: "10px",
                      backgroundColor: "#F8FAFC",
                    }}
                  >
                    {renderQuestionInput()}
                  </div>
                </>
              )}
              <Button
                style={{ marginTop: "20px", display: "block", float: "right" }}
                type="submit"
              >
                {isEdit ? "Save Changes" : "Add Question"}
              </Button>
            </form>
          </CardContainer>
        </CardWrapper>
      </Container>
    </BaseBackground>
  );
}

export default QuestionForm;
