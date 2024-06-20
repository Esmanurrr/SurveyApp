import { Button, Span, TextCenter } from "../../style"

function AddQuestionButton() {
  return (
    <TextCenter>
        <h2>Lets add some questions to your survey</h2>
        <Span>Click the button below to get your survey up and running</Span>
        <div><Button>Add a question</Button></div>
    </TextCenter>
  )
}

export default AddQuestionButton