import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuestionAsync,
  fetchQuestionsAsync,
  updateQuestionAsync,
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
  const [questionData, setQuestionData] = useState({
    name: "",
    type: "",
    options: [],
    responseType: "Text",
    canBeSkipped: false,
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { questionId } = useParams();
  const { questions, loading } = useSelector((state) => state.question);

  useEffect(() => {
    const fetchQuestionData = async () => {
      if (isEdit && questionId) {
        try {
          const result = await dispatch(fetchQuestionsAsync(surveyId)).unwrap();
          const question = result.find((q) => q.id === questionId);
          if (question) {
            setQuestionData({
              name: question.name || "",
              type: question.type || "",
              options: question.options || [],
              responseType: question.responseType || "Text",
              canBeSkipped:
                question.canBeSkipped !== undefined
                  ? question.canBeSkipped
                  : true,
            });
          }
        } catch (error) {
          toast.error("Failed to fetch question data", {
            position: "top-right",
          });
        }
      }
    };

    fetchQuestionData();
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
      const newData = {
        ...questionData,
        type: value,
        responseType:
          value === "Text Response" ? "Text" : questionData.responseType,
        options:
          value === "Single Choice" || value === "Multiple Choice"
            ? questionData.options
            : [],
      };
      setQuestionData(newData);

      // Soru tipi değiştiğinde validasyon yap
      try {
        const schema = yup.reach(questionSchema, "type");
        schema.validateSync(value);
        setErrors((prev) => {
          const { type, ...rest } = prev;
          // Eğer Single/Multiple Choice değilse options hatalarını temizle
          if (!(value === "Single Choice" || value === "Multiple Choice")) {
            const { options, ...remaining } = rest;
            return remaining;
          }
          return rest;
        });
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          type: err.message,
        }));
      }
    } else {
      const newValue = name === "canBeSkipped" ? value === "true" : value;
      setQuestionData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
      validateField(name, newValue);
    }
  };

  const handleOptionsChange = (newOptions) => {
    setQuestionData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const setInputType = (inputType) => {
    setQuestionData((prevData) => ({
      ...prevData,
      responseType: inputType,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const filteredOptions = questionData.options.filter(
      (option) => option && option.trim().length > 0
    );

    const dataToValidate = {
      ...questionData,
      options: filteredOptions,
    };

    try {
      await questionSchema.validate(dataToValidate, { abortEarly: false });

      if (isEdit) {
        await dispatch(
          updateQuestionAsync({
            surveyId,
            updatedQuestion: {
              ...questionData,
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
            newQuestion: { ...questionData, options: filteredOptions },
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
    switch (questionData.type) {
      case "Single Choice":
      case "Multiple Choice":
        return (
          <>
            <LabelDiv>Options</LabelDiv>
            <Choices
              options={questionData.options}
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
              inputType={questionData.responseType}
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

  if (loading) return <LoadingPage />;

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
                  value={questionData.name}
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
                    value={questionData.type}
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
                    value={String(questionData.canBeSkipped)}
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
              <LabelDiv>Preview</LabelDiv>
              <div
                style={{
                  border: "1px solid #ddd",
                  boxShadow: "0 10px 10px 0 rgba(0, 0, 0, 0.1)",
                  padding: "10px",
                  borderRadius: "10px",
                  marginTop: "10px",
                  backgroundColor: "#F5F5F7",
                }}
              >
                {renderQuestionInput()}
              </div>
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
