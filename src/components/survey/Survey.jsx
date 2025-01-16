import { useParams } from "react-router-dom";
import QuestionList from "../question/QuestionList";
import SurveyHeader from "./SurveyHeader";
import { useEffect } from "react";
import LoadingPage from "../infos/LoadingPage";
import NotFound from "../infos/NotFound";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestionsAsync } from "../../redux/question/questionSlice";
import { fetchSurveyByIdAsync } from "../../redux/suryvey/surveySlice";
import { useAuth } from "../../contexts/authContext";
import { Navigate } from "react-router-dom";

const Survey = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { userLoggedIn, loading: authLoading } = useAuth();
  const {
    currentSurvey,
    loading: surveyLoading,
    error,
  } = useSelector((state) => state.survey);

  useEffect(() => {
    if (userLoggedIn && id) {
      dispatch(fetchSurveyByIdAsync(id));
      dispatch(fetchQuestionsAsync(id));
    }
  }, [dispatch, id, userLoggedIn]);

  if (authLoading) {
    return <LoadingPage />;
  }

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (surveyLoading) {
    return <LoadingPage />;
  }

  if (error || !currentSurvey) {
    return <NotFound />;
  }

  return (
    <div>
      <div>
        <SurveyHeader
          title={currentSurvey.title}
          description={currentSurvey.description}
          id={id}
        />
        <QuestionList surveyId={id} />
      </div>
    </div>
  );
};

export default Survey;
