import { useState } from "react";
import { CardContainer, Container, Dropdown, DropdownWrapper, Flex, Input, LabelDiv } from "../../style";
import ChoiceInput from "../options/ChoiceInput";
import Choices from "../options/Choices";
import DeleteInput from "../options/DeleteInput";
import Options from "../options/Options";

function AddQuestion() {
  const [questionType, setQuestionType] = useState("")

  const handleQuestionType = (e) => {
    setQuestionType(e.target.value);
  }

  return (
    <Container>
      <CardContainer>
        <form>
          <div>
            <LabelDiv>Question</LabelDiv>
            <Input type="text" />
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
          {
            (questionType === "Single Choice" || questionType === "Multiple Choice") && (
              <>
                <LabelDiv>Options</LabelDiv>
                <Choices/>
              </>
            )
          }
        </form>
      </CardContainer>
    </Container>
  );
}

export default AddQuestion;
