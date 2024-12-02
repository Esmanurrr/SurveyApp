import { useLocation, useParams } from "react-router-dom";
import QuestionList from "../question/QuestionList";
import SurveyHeader from "./SurveyHeader";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import LoadingPage from "../infos/LoadingPage";

const Survey = () => {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const { title, description } = location.state || {};
  const { id } = useParams();

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!id) {
        console.log("ID tanımlı değil.");
        return; // Eğer id tanımlı değilse, fonksiyonu sonlandır
      }

      try {
        const surveyRef = doc(collection(db, "surveys"), id); // Firestore'daki anket referansı
        const surveyDoc = await getDoc(surveyRef); // Anket belgesini al

        if (surveyDoc.exists()) {
          const surveyData = surveyDoc.data();
          setQuestions(surveyData.questions); // Soruları ayarla
        } else {
          console.log("Survey not found");
          // not found sayfası ekle
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
