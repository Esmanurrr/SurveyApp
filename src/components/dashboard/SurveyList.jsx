import { useEffect, useState } from "react";
import SurveyCard from "./SurveyCard";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

function SurveyList() {

    const [surveys, setSurveys] = useState([]);

    const fetchSurveys = async () => {
      try {
        // Anketler koleksiyonuna referans al
        const surveysCollection = collection(db, "surveys");
        
        // Koleksiyondaki tüm belgeleri al
        const surveySnapshot = await getDocs(surveysCollection);
        
        // Anket verilerini düzenle
        const surveyList = surveySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
    
        setSurveys(surveyList);
      } catch (err) {
        console.log("Anketler çekilirken hata oluştu:", err);
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
