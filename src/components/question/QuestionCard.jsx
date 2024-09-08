import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, DeleteButton, EditButton } from "../../style";
import axios from "axios";


function QuestionCard({question , surveyId, onQuestionDelete}) {
    const navigate = useNavigate();

    const handleEdit = () => {
      navigate(`/survey/edit-question/${question.id}`, {
        state: {surveyId}
      });
    };

    const handleDelete = async (questionId) => {
      try {
        const survey = await axios.get(`http://localhost:4000/surveys/${surveyId}`);

        const updatedQuestions = survey.data.questions.filter((q) => q.id !== questionId);
        const updatedSurvey = { ...survey.data, questions: updatedQuestions };

        await axios.put(`http://localhost:4000/surveys/${surveyId}`, updatedSurvey);

        if (onQuestionDelete) {
          onQuestionDelete(questionId);
        }

        console.log("Soru başarıyla silindi");
      } catch (err) {
        console.log(err);
      }
    };

  return (
    <Card>
          <div>
            <h2>{question.name}</h2>
            <span>{question.type}</span>
          </div>
          <div>
            <EditButton onClick={handleEdit}>Edit</EditButton>
            <DeleteButton onClick={()=> handleDelete(question.id)}><i className="fa-solid fa-trash"></i></DeleteButton>
          </div>
    </Card>
  )
}

export default QuestionCard