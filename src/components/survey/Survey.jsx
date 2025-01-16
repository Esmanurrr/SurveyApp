import { useLocation, useParams } from "react-router-dom";
import QuestionList from "../question/QuestionList";
import SurveyHeader from "./SurveyHeader";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import LoadingPage from "../infos/LoadingPage";
import NotFound from "../infos/NotFound";
import { useDispatch } from "react-redux";
import { fetchQuestionsAsync } from "../../redux/question/questionSlice";

const Survey = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { title, description } = location.state || {};
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchQuestionsAsync(id));
  }, [dispatch, id]);

  return (
    <div>
      <div>
        <SurveyHeader title={title} description={description} id={id} />
        <QuestionList surveyId={id} />
      </div>
    </div>
  );
};

export default Survey;
