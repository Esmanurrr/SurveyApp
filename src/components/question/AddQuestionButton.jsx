import { Link, useParams } from "react-router-dom"
import { Button, TextCenter } from "../../style"

function AddQuestionButton() {

  const params = useParams();

  return (
    <TextCenter>
        <div><Link to={`/survey/new-question/${params.id}`}><Button>Add a question</Button></Link></div>
    </TextCenter>
  )
}

export default AddQuestionButton