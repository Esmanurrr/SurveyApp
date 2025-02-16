import { useDispatch } from "react-redux";
import { deleteSurveyAsync } from "../../redux/survey/surveySlice";
import { toast } from "react-toastify";
import { HorizontalListContainer, EmptyState } from "../../style";
import SurveyCard from "./SurveyCard";

function SurveyList({ surveys }) {
  const dispatch = useDispatch();

  const handleDelete = async (surveyId) => {
    try {
      await dispatch(deleteSurveyAsync(surveyId)).unwrap();
      toast.success("Survey deleted successfully", {
        position: "top-right",
      });
    } catch (error) {
      toast.error(error || "Failed to delete survey", {
        position: "top-right",
      });
    }
  };

  if (surveys.length === 0) {
    return (
      <EmptyState>
        <h3>No Surveys Yet</h3>
        <p>Create your first survey to get started!</p>
      </EmptyState>
    );
  }

  return (
    <HorizontalListContainer>
      {surveys.map((survey) => (
        <SurveyCard
          key={survey.id}
          survey={survey}
          onDelete={() => handleDelete(survey.id)}
        />
      ))}
    </HorizontalListContainer>
  );
}

export default SurveyList;
