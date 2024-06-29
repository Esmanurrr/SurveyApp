import { useEffect, useState } from "react";
import { CardContainer, Container, Dropdown, DropdownWrapper, Flex, InputRes, LabelDiv } from "../../style";
import Choices from "../options/Choices";
import InputResponse from "../options/InputResponse";

function AddQuestion() {
  const [questionType, setQuestionType] = useState("");
  // const [showInput, setShowInput] = useState(false);

  // useEffect(() => {
  //   if(questionType === "Single Choice" || questionType === "Multiple Choice"){
  //     setShowInput(true);
  //   }else{
  //     setShowInput(false);
  //   }
  // }, [questionType])

  const renderQuestionInput = () => {
    switch(questionType) {
      case "Single Choice":
      case "Multiple Choice":
        return (
          <>
            <LabelDiv>Options</LabelDiv>
            <Choices />
          </>
        );
      case "Text Response":
        return (<><InputResponse /> {console.log("input çalıştı")}</>);
      case "Long Text Response":
        return <InputRes type="text" placeholder="Enter your response" />;
      default:
        return null;
    }
  };

  const handleQuestionType = (e) => {
    setQuestionType(e.target.value);
  }

  return (
    <Container>
      <CardContainer>
        <form>
          <div>
            <LabelDiv>Question</LabelDiv>
            <InputRes type="text" />
          </div>
          <Flex>
            <DropdownWrapper onChange={handleQuestionType}>
              <LabelDiv>Question type</LabelDiv>
              <Dropdown>
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
        </form>
      </CardContainer>
    </Container>
  );
}

export default AddQuestion;
