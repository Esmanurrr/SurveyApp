import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuestionAsync,
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
          name: question.name || "",
          type: question.type || "",
          options: question.options || [],
          responseType: question.responseType || "Text",
          canBeSkipped: question.canBeSkipped || false,
        });
      }
    }
  }, [isEdit, questionId, questions]);

  const validateField = (name, value) => {
    yup
      .reach(questionSchema, name)
      .validate(value)
      .then(() => {
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors[name];
          return updatedErrors;
        });
      })
      .catch((err) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: err.message,
        }));
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => {
      if (name === "type") {
        return {
          ...prevData,
          type: value,
          responseType:
            value === "Text Response" ? "Text" : prevData.responseType,
          options:
            value === "Single Choice" || value === "Multiple Choice"
              ? prevData.options
              : [],
        };
      }
      return {
        ...prevData,
        [name]: name === "canBeSkipped" ? value === "true" : value,
      };
    });

    validateField(name, value);
  };

  const handleOptionsChange = (newOptions) => {
    setQuestionData((prevData) => ({
      ...prevData,
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
    try {
      await questionSchema.validate(questionData, { abortEarly: false });
      if (isEdit) {
        dispatch(
          updateQuestionAsync({ surveyId, updatedQuestion: questionData })
        )
          .unwrap()
          .then(() => {
            toast.success("Question updated successfully", {
              position: "top-right",
            });
            navigate(`/survey/${surveyId}`);
          })
          .catch((error) => {
            toast.error("Failed to update question", { position: "top-right" });
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
        toast.error(validationError.errors[0], { position: "top-right" });
      } else {
        toast.error("Failed to save question", { position: "top-right" });
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
            {errors.options && <p style={{ color: "red" }}>{errors.options}</p>}
          </>
        );
      case "Text Response":
        return (
          <>
            <InputResponse
              inputType={questionData.responseType}
              setInputType={setInputType}
            />
          </>
        );
      case "Long Text Response":
        return <InputRes type="text" placeholder="Enter your response" />;
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
              <LabelDiv>
                <label>Question Name</label>
                <InputRes
                  type="text"
                  name="name"
                  value={questionData.name}
                  onChange={handleChange}
                  required
                />
              </LabelDiv>
              <DropdownWrapper>
                <label>Question Type</label>
                <Dropdown
                  name="type"
                  value={questionData.type}
                  onChange={handleChange}
                >
                  <option value="">Choose a question type</option>
                  <option value="Single Choice">Single Choice</option>
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Text Response">Text Response</option>
                  <option value="Long Text Response">Long Text Response</option>
                </Dropdown>
              </DropdownWrapper>
              {renderQuestionInput()}
              <Flex>
                <label>Can be skipped?</label>
                <Dropdown
                  name="canBeSkipped"
                  value={String(questionData.canBeSkipped)}
                  onChange={handleChange}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Dropdown>
              </Flex>
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
