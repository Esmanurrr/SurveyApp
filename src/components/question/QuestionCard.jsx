import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, DeleteButton, EditButton } from "../../style";
import axios from "axios";


function QuestionCard({question , surveyId}) {
    const navigate = useNavigate();

    const handleEdit = () => {
      navigate(`/survey/edit-question/${question.id}`, {
        state: {surveyId}
      });
    };

    const handleDelete = async () => {
      try {
        const surveys = await axios.get(`http://localhost:4000/surveys/${surveyId}`);
        const question = surveys.data.questions.filter(q => q.id === question.id);
        console.log("Soru başarıyla silindi");
      } catch (err) {
        console.log(err);
      }
    };

  return (
    <Card style={{width: "60%", padding: "1rem", display: "flex", justifyContent:"space-between", alignItems: "center"}}>
          <div>
            <h2>{question.name}</h2>
            <span>{question.type}</span>
          </div>
          <div>
            <EditButton onClick={handleEdit}>Edit</EditButton>
            <DeleteButton onClick={handleDelete}><i className="fa-solid fa-trash"></i></DeleteButton>
          </div>
    </Card>
  )
}

export default QuestionCard