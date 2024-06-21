import { Container } from "../../style"
import AddQuestionButton from "./AddQuestionButton"

function QuestionList({question}) {
  return (
    <Container>
        {
            !question && <AddQuestionButton/>
        }
    </Container>
  )
}

export default QuestionList