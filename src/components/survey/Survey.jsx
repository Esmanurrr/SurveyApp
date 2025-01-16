import { useLocation, useParams } from "react-router-dom";
import QuestionList from "../question/QuestionList";
import SurveyHeader from "./SurveyHeader";
import { useEffect } from "react";
import LoadingPage from "../infos/LoadingPage";
import NotFound from "../infos/NotFound";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestionsAsync } from "../../redux/question/questionSlice";
import { fetchSurveyByIdAsync } from "../../redux/suryvey/surveySlice";

const Survey = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { currentSurvey, loading, error } = useSelector(
    (state) => state.survey
  );

  useEffect(() => {
    if (!location.state) {
      dispatch(fetchSurveyByIdAsync(id));
    }
    dispatch(fetchQuestionsAsync(id));
  }, [dispatch, id, location.state]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error || (!currentSurvey && !location.state)) {
    return <NotFound />;
  }

  const surveyData = location.state || currentSurvey;

  return (
    <div>
      <div>
        <SurveyHeader
          title={surveyData.title}
          description={surveyData.description}
          id={id}
        />
        <QuestionList surveyId={id} />
      </div>
    </div>
  );
};

export default Survey;
