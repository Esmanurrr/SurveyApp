import { useDispatch } from "react-redux";
import { deleteQuestionAsync } from "../../redux/question/questionSlice";
import { Card, CardWrapper, DeleteButton, EditButton } from "../../style";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function QuestionCard({ question, surveyId, index }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEdit = () => {
    if (question.id) {
      navigate(`/survey/edit-question/${question.id}`, {
        state: { surveyId },
      });
    } else {
      console.error("Question ID is undefined");
    }
  };

  const handleDelete = () => {
    if (question.id) {
      dispatch(deleteQuestionAsync({ surveyId, questionId: question.id }))
        .unwrap()
        .then(() => {
          toast.success("Question deleted successfully", {
            position: "top-right",
          });
        })
        .catch((error) => {
          toast.error("Failed to delete question", { position: "top-right" });
        });
    } else {
      console.error("Question ID is undefined");
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
          <DeleteButton onClick={handleDelete}>
            <i className="fa-solid fa-trash"></i>
          </DeleteButton>
        </div>
      </Card>
    </CardWrapper>
  );
}

export default QuestionCard;
