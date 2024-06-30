import { Link, useParams } from "react-router-dom"
import { Button, Span, TextCenter } from "../../style"

function AddQuestionButton() {

  const params = useParams();

  return (
    <TextCenter>
        <h2>Lets add some questions to your survey</h2>
        <Span>Click the button below to get your survey up and running</Span>
        <div><Link to={`/survey/new-question/${params.id}`}><Button>Add a question</Button></Link></div>
    </TextCenter>
  )
}

export default AddQuestionButton