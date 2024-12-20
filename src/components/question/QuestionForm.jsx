import { useEffect, useState } from "react";
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
import Choices from "../options/Choices";
import InputResponse from "../options/InputResponse";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import LoadingPage from "../infos/LoadingPage";
import {
  questionSchema,
} from "../../validations/schemas/surveySchema";
import * as yup from "yup";


function QuestionForm({ isEdit, surveyId }) {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [questionData, setQuestionData] = useState({
    name: "",
    type: "",
    options: [],
    responseType: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const surveyRef = doc(db, "surveys", surveyId);
        const surveyDoc = await getDoc(surveyRef);
        if (surveyDoc.exists()) {
          const surveyData = surveyDoc.data();
          setSurvey(surveyData);
          setLoading(false);
          if (isEdit) {
            const question = surveyData.questions.find(
              (q) => q.id === questionId
            );
            if (question) {
              setQuestionData({
                name: question.name,
                type: question.type,
                options: question.options || [],
                responseType: question.responseType || "",
                canBeSkipped:
                  question.canBeSkipped !== undefined
                    ? question.canBeSkipped
                    : true,
              });
            } else {
              console.log("Question not found");
            }
          }
        } else {
          console.log("Survey not found");
        }
      } catch (err) {
        console.log(err);
        console.log("survey id:", surveyId);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyId, questionId, isEdit]);

  const validateField = (name, value) => {
    yup
      .reach(questionSchema, name)
      .validate(value)
      .then(() => {
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors[name]; // Hata varsa temizle
          return updatedErrors;
        });
      })
      .catch((err) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: err.message, // Yeni hata mesajını ekle
        }));
      });
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => ({
      ...prevData,
      [name]: name === "canBeSkipped" ? value === "true" : value,
    }));

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredOptions = questionData.options.filter(
      (option) => option && option.trim().length > 0
    );
  

    try {
      await questionSchema.validate({...questionData, options: filteredOptions}, { abortEarly: false });

      const newQuestion = {
        id: isEdit ? questionId : crypto.randomUUID(),
        name: questionData.name,
        type: questionData.type,
        options:
          questionData.type === "Single Choice" ||
          questionData.type === "Multiple Choice"
            ? filteredOptions
            : [],
        responseType: questionData.responseType,
        canBeSkipped:
          questionData.canBeSkipped !== undefined
            ? questionData.canBeSkipped
            : "true",
      };

      const surveyRef = doc(db, "surveys", surveyId);
      let updatedSurvey;

      if (isEdit) {
        const updatedQuestions = survey.questions.map((question) =>
          question.id === questionId
            ? { ...question, ...questionData }
            : question
        );
        console.log("edit butonuna tıklanıldı");
        updatedSurvey = { ...survey, questions: updatedQuestions };

        try {
          await updateDoc(surveyRef, { questions: updatedQuestions });
          console.log("Soru başarıyla güncellendi");
        } catch (err) {
          console.log("Güncelleme hatası: ", err);
        }
      } else {
        updatedSurvey = {
          ...survey,
          questions: [...survey.questions, newQuestion],
        };
      }

      await updateDoc(surveyRef, { questions: updatedSurvey.questions });
      console.log("Soru başarıyla eklendi");
      navigate(-1);
    } catch (validationError) {
      if (validationError.inner) {
        const errorMessages = validationError.inner.reduce((acc, error) => {
          acc[error.path] = error.message;
          return acc;
        }, {});
        setErrors(errorMessages);
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
            <form onSubmit={handleSubmit}>
              <div>
                <LabelDiv>Question</LabelDiv>
                <InputRes
                  type="text"
                  name="name"
                  value={questionData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && (
                <p style={{ color: "red" }} className="error-message">
                  {errors.name}
                </p>
              )}
              <Flex>
                <DropdownWrapper>
                  <LabelDiv>Question type</LabelDiv>
                  <Dropdown
                    name="type"
                    onChange={handleChange}
                    value={questionData.type}
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
                  {errors.type && <p style={{ color: "red" }}>{errors.type}</p>}
                </DropdownWrapper>
                <DropdownWrapper>
                  <LabelDiv>Can this question be skipped?</LabelDiv>
                  <Dropdown
                    name="canBeSkipped"
                    value={String(questionData.canBeSkipped)}
                    onChange={handleChange}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Dropdown>
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
