import { useEffect, useState } from "react";
import { Button, CardContainer, Container, Dropdown, DropdownWrapper, Flex, InputRes, LabelDiv } from "../../style";
import Choices from "../options/Choices";
import InputResponse from "../options/InputResponse";
import { useParams } from "react-router-dom";
import axios from "axios";

function AddQuestion() {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [questionData, setQuestionData] = useState({
    name: "", type: "", options: [], responseType: ""
  });
 
  useEffect(() => {
    const fetchSurvey = async () => {
      try{
        const response = await axios.get(`http://localhost:4000/surveys/${surveyId}`);
        setSurvey(response.data);
      }catch(err){
        console.log(err);
      }
    }

    fetchSurvey();
  }, [surveyId])

  const handleChange = (e) => {
    const {name, value} = e.target;
    setQuestionData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }

  const handleOptionsChange = (newOpitons) => {
    setQuestionData((prevData) => ({
      ...prevData,
      options: newOpitons
    }));
  }

  const setInputType = (inputType) => {
    setQuestionData((prevData) => ({
      ...prevData,
      responseType: inputType
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuestion = {
      id: crypto.randomUUID(),
      name: questionData.name,
      type: questionData.type,
      options: (questionData.type === "Single Choice" || questionData.type === "Multiple Choice") ? questionData.options : [],
      responseType: questionData.responseType 
    };

    const updatedSurvey = {
      ...survey,
      questions: [...survey.questions, newQuestion]
    };

    try {
      const response = await axios.put(`http://localhost:4000/surveys/${surveyId}`, updatedSurvey);
      console.log("soru başarıyla eklendi", response.data);
    }catch(err) {
      console.log(err);
    }
  }

  const renderQuestionInput = () => {
    switch(questionData.type) {
      case "Single Choice":
      case "Multiple Choice":
        return (
          <>
            <LabelDiv>Options</LabelDiv>
            <Choices options={questionData.options} setOptions={handleOptionsChange} />
          </>
        );
      case "Text Response":
        return (<><InputResponse inputType={questionData.responseType} setInputType={setInputType} /></>);
      case "Long Text Response":
        return <InputRes type="text" placeholder="Enter your response" />;
      default:
        return null;
    }
  };


  return (
    <Container>
      <CardContainer>
        <form onSubmit={handleSubmit}>
          <div>
            <LabelDiv>Question</LabelDiv>
            <InputRes type="text" name="name" value={questionData.name} onChange={handleChange}/>
          </div>
          <Flex>
            <DropdownWrapper>
              <LabelDiv>Question type</LabelDiv>
              <Dropdown name="type" onChange={handleChange} value={questionData.type}>
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
          <Button style={{marginTop: "20px",display: "block"}}type="submit">Save Changes</Button>
        </form>
      </CardContainer>
    </Container>
  );
}

export default AddQuestion;
