import { Link, useParams } from "react-router-dom";
import { Card, DeleteButton, EditButton, Flex } from "../../style";
import axios from "axios";


function QuestionCard({question, surveyId, onDelete}) {

    const id = question.id;
    console.log(id);

    // const handleDeleteQuestion = async (surveyId, id) => {
    //     await axios.delete(`http://localhost:4000/surveys/${surveyId}/questions/${id}`);
    // }

  return (
    <Card style={{width: "60%", padding: "1rem", display: "flex", justifyContent:"space-between", alignItems: "center"}}>
          <div>
            <h2>{question.name}</h2>
            <span>{question.type}</span>
          </div>
          <div>
            <EditButton>Edit</EditButton>
            <DeleteButton onClick={onDelete}><i className="fi fi-rs-trash"></i></DeleteButton>
          </div>
    </Card>
  )
}

export default QuestionCard