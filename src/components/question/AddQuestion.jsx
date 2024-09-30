import { useParams } from "react-router-dom";
import QuestionForm from "./QuestionForm";

function AddQuestion() {
  const { surveyId } = useParams(); 

  return <QuestionForm isEdit={false}  surveyId={surveyId} />;
}

export default AddQuestion;
