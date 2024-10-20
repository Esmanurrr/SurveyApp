import { useLocation, useParams } from 'react-router-dom';
import QuestionList from '../question/QuestionList'
import SurveyHeader from './SurveyHeader'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseBackground } from '../../style';
import { db } from '../../firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

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
        console.log(surveyDoc);

        if (surveyDoc.exists()) {
          const surveyData = surveyDoc.data();
          setQuestions(surveyData.questions); // Soruları ayarla
        } else {
          console.log("Survey not found");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchQuestions();

  },[id])



  return (
    <div>
        <SurveyHeader title={title} description={description} id={id}/>
        <QuestionList questions={questions} surveyId={id}/>
    </div>
  )
}

export default Survey