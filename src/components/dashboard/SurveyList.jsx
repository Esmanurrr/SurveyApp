import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteSurveyAsync } from "../../redux/survey/surveySlice";
import { toast } from "react-toastify";
import {
  HorizontalListContainer,
  HorizontalCard,
  CardContent,
  CardTitle,
  CardDescription,
  CardMeta,
  CardMetaItem,
  CardActions,
  ActionButton,
  EmptyState,
} from "../../style";

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
        <HorizontalCard key={survey.id}>
          <CardContent>
            <CardTitle>{survey.title}</CardTitle>
            <CardDescription>
              {survey.description || "No description"}
            </CardDescription>
            <CardMeta>
              <CardMetaItem>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
                {new Date(survey.createdAt).toLocaleDateString()}
              </CardMetaItem>
              <CardMetaItem>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z" />
                </svg>
                {survey.questions?.length || 0} Questions
              </CardMetaItem>
            </CardMeta>
          </CardContent>

          <CardActions>
            <ActionButton as={Link} to={`/survey/${survey.id}`} primary>
              View Survey
            </ActionButton>
            <ActionButton danger onClick={() => handleDelete(survey.id)}>
              Delete
            </ActionButton>
          </CardActions>
        </HorizontalCard>
      ))}
    </HorizontalListContainer>
  );
}

export default SurveyList;
