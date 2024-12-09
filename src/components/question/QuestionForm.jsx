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
import { db } from "../../firebase";
import LoadingPage from "../infos/LoadingPage";

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
                canBeSkipped: question.canBeSkipped !== undefined ? question.canBeSkipped : true,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => ({
      ...prevData,
      [name]: name === "canBeSkipped" ? value === "true" : value,
    }));
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

    const newQuestion = {
      id: isEdit ? questionId : crypto.randomUUID(),
      name: questionData.name,
      type: questionData.type,
      options:
        questionData.type === "Single Choice" ||
        questionData.type === "Multiple Choice"
          ? questionData.options
          : [],
      responseType: questionData.responseType,
      canBeSkipped: questionData.canBeSkipped !== undefined ? questionData.canBeSkipped : "true",
    };

    const surveyRef = doc(db, "surveys", surveyId);
    let updatedSurvey;

    if (isEdit) {
      const updatedQuestions = survey.questions.map((question) =>
        question.id === questionId ? { ...question, ...questionData } : question
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

    try {
      await updateDoc(surveyRef, { questions: updatedSurvey.questions }); 
      console.log("Soru başarıyla eklendi");
      navigate(-1);
    } catch (err) {
      console.log(err);
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
                </DropdownWrapper>
                <DropdownWrapper>
                  <LabelDiv>Can this question be skipped?</LabelDiv>
                  <Dropdown
                    name="canBeSkipped"
                    value={questionData.canBeSkipped ? "true" : "false"}
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
