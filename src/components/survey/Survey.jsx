import { useLocation, useParams } from 'react-router-dom';
import QuestionList from '../question/QuestionList'
import SurveyHeader from './SurveyHeader'
import { useEffect, useState } from 'react';
import axios from 'axios';

const Survey = () => {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const { title, description } = location.state || {};
  const { id } = useParams();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:4000/surveys");
        const survey = response.data.find(survey => survey.id === id);
        if(survey){
          setQuestions(survey.questions);
        }else{
          console.log("Survey not found");
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchQuestions();

  },[id])



  return (
    <div>
        <SurveyHeader title={title} description={description} id={id}/>
        <QuestionList questions={questions}/>
    </div>
  )
}

export default Survey