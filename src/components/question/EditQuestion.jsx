import { useLocation, useParams } from "react-router-dom";
import QuestionForm from "./QuestionForm";

function EditQuestion() {
  const location = useLocation();
  const { surveyId } = location.state || {};

  return <QuestionForm isEdit={true} surveyId={surveyId} />;
}

export default EditQuestion;
