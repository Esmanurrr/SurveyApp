import { useEffect, useState } from "react";
import SurveyCard from "./SurveyCard";
import axios from "axios";

function SurveyList() {

    const [surveys, setSurveys] = useState([]);

    const fetchSurveys = async () => {
      try {
        const response = await axios.get("http://localhost:4000/surveys");
        setSurveys(response.data);
      } catch (err) {
        console.log(err);
      }
    };
  
    useEffect(() => {
      fetchSurveys();
    }, []);
  
    return (
      <>
        {surveys.length > 0 ? (
          surveys.map((survey) => <SurveyCard key={survey.id} survey={survey} />)
        ) : (
          <p>No surveys available</p>
        )}
      </>
    );
}

export default SurveyList;
