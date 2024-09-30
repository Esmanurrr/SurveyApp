import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
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
import axios from "axios";

function EditQuestion() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState({
    name: "",
    type: "",
    options: [],
    responseType: "",
  });
  const location = useLocation();
  const { surveyId } = location.state || {};

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const surveys = await axios.get(
          `http://localhost:4000/surveys/${surveyId}`
        );
        const question = surveys.data.questions.find(
          (q) => q.id === questionId
        );
        console.log(surveys.data);

        if (question) {
          setQuestionData({
            name: question.name,
            type: question.type,
            options: question.options || [],
            responseType: question.responseType || "",
          });
        } else {
          console.log("Question not found");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => ({
      ...prevData,
      [name]: value,
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

    try {
      const surveyResponse = await axios.get(
        `http://localhost:4000/surveys/${surveyId}`
      );
      const survey = surveyResponse.data;

      const updatedQuestions = survey.questions.map((question) =>
        question.id === questionId ? { ...question, ...questionData } : question
      );

      const updatedSurvey = { ...survey, questions: updatedQuestions };

      await axios.put(
        `http://localhost:4000/surveys/${surveyId}`,
        updatedSurvey
      );

      console.log("Soru başarıyla güncellendi");
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

  return (
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
                  disabled
                  name="type"
                  onChange={handleChange}
                  value={questionData.type}
                >
                  <option value="">Choose a question type</option>
                  <option value="Single Choice">Single Choice</option>
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Text Response">Text Response</option>
                  <option value="Long Text Response">Long Text Response</option>
                </Dropdown>
              </DropdownWrapper>
              <DropdownWrapper>
                <LabelDiv>Can this question be skipped?</LabelDiv>
                <Dropdown>
                  <option>Yes</option>
                  <option>No</option>
                </Dropdown>
              </DropdownWrapper>
            </Flex>
            {renderQuestionInput()}
            <Button
              style={{ marginTop: "20px", display: "block", float:"right" }}
              type="submit"
            >
              Save Changes
            </Button>
          </form>
        </CardContainer>
      </CardWrapper>
    </Container>
  );
}

export default EditQuestion;
