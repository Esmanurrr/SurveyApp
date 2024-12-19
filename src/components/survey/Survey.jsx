import { useLocation, useParams } from "react-router-dom";
import QuestionList from "../question/QuestionList";
import SurveyHeader from "./SurveyHeader";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import LoadingPage from "../infos/LoadingPage";
import NotFound from "../infos/NotFound";

const Survey = () => {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const { title, description } = location.state || {};
  const { id } = useParams();

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!id) {
        console.log("ID tanımlı değil.");
        return; 
      }

      try {
        const surveyRef = doc(collection(db, "surveys"), id); 
        const surveyDoc = await getDoc(surveyRef); 

        if (surveyDoc.exists()) {
          const surveyData = surveyDoc.data();
          setQuestions(surveyData.questions); 
        } else {
          console.log("Survey not found");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchQuestions();
  }, [id]);


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
