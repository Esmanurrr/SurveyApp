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
    if (isEdit && questionId) {
      const question = questions.find((q) => q.id === questionId);
      if (question) {
        setQuestionData({
          ...question,
          name: question.name || "",
          type: question.type || "",
          options: question.options || [],
          responseType: question.responseType || "Text",
          canBeSkipped:
            question.canBeSkipped !== undefined ? question.canBeSkipped : true,
        });
      }
    }
  }, [isEdit, questionId, questions]);

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

      // Soru tipi değiştiğinde options validasyonunu temizle
      if (!(value === "Single Choice" || value === "Multiple Choice")) {
        setErrors((prev) => {
          const { options, ...rest } = prev;
          return rest;
        });
      } else {
        validateField("options", newData.options);
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

    if (
      questionData.type === "Single Choice" ||
      questionData.type === "Multiple Choice"
    ) {
      validateField("options", newOptions);
    }
  };

  const setInputType = (inputType) => {
    setQuestionData((prevData) => ({
      ...prevData,
      responseType: inputType,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await questionSchema.validate(questionData, { abortEarly: false });
      if (isEdit) {
        dispatch(
          updateQuestionAsync({
            surveyId,
            updatedQuestion: {
              ...questionData,
              id: questionId,
            },
          })
        )
          .unwrap()
          .then(() => {
            toast.success("Question updated successfully", {
              position: "top-right",
            });
            navigate(`/survey/${surveyId}`);
          })
          .catch((error) => {
            toast.error("Failed to update question: " + error, {
              position: "top-right",
            });
          });
      } else {
        dispatch(addQuestionAsync({ surveyId, newQuestion: questionData }))
          .unwrap()
          .then(() => {
            toast.success("Question added successfully", {
              position: "top-right",
            });
            navigate(`/survey/${surveyId}`);
          })
          .catch((error) => {
            toast.error("Failed to add question", { position: "top-right" });
          });
      }
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        const newErrors = {};
        validationError.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
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
                  required
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
              {renderQuestionInput()}
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
