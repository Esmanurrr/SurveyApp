import { Container, Span } from "../../style"
import AddQuestionButton from "./AddQuestionButton"
import QuestionCard from "./QuestionCard"

function QuestionList({questions, surveyId}) {
  return (
    <Container>
        {
            !questions && 
            <div>
              <h2>Lets add some questions to your survey</h2>
              <Span>Click the button below to get your survey up and running</Span>
              <AddQuestionButton/>
            </div>
        }
        {
          questions.length > 0 && questions.map((question,index) => (
            <QuestionCard surveyId={surveyId} key={index} question={question} />
          ))
        }
        <AddQuestionButton />
    </Container>
  )
}

export default QuestionList