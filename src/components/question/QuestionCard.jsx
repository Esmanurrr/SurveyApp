import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardWrapper, DeleteButton, EditButton } from "../../style";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function QuestionCard({ question, surveyId, onQuestionDelete, index }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/survey/edit-question/${question.id}`, {
      state: { surveyId },
    });
  };

  const handleDelete = async (questionId) => {
    try {
      const surveyRef = doc(db, "surveys", surveyId);
      const surveyDoc = await getDoc(surveyRef);
  
      if (surveyDoc.exists()) {
        const surveyData = surveyDoc.data();
        
        const updatedQuestions = surveyData.questions.filter(
          (q) => q.id !== questionId
        );
  
        await updateDoc(surveyRef, { questions: updatedQuestions });
  
        if (onQuestionDelete) {
          onQuestionDelete(questionId);
        }
  
        console.log("Soru başarıyla silindi");
      } else {
        console.log("Anket bulunamadı!");
      }
    } catch (err) {
      console.error("Soru silinirken hata oluştu:", err);
    }
  };

  return (
    <CardWrapper>
      <Card>
        <div>
          <h2>
            {index + 1}. {question.name}
          </h2>
          <span>{question.type}</span>
        </div>
        <div>
          <EditButton onClick={handleEdit}>Edit</EditButton>
          <DeleteButton onClick={() => handleDelete(question.id)}>
            <i className="fa-solid fa-trash"></i>
          </DeleteButton>
        </div>
      </Card>
    </CardWrapper>
  );
}

export default QuestionCard;
