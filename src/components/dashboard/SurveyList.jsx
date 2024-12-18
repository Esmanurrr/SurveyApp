import { useEffect, useState } from "react";
import SurveyCard from "./SurveyCard";
import { auth, db } from "../../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import LoadingPage from "../infos/LoadingPage";

function SurveyList() {

    const [surveys, setSurveys] = useState([]);

    const fetchUserSurveys = async () => {
      try {
        const userId = auth.currentUser.uid;
        const surveysRef = collection(db, "surveys");
        const q = query(surveysRef, where("userId", "==", userId)); // Sadece bu kullanıcıya ait anketler
        const querySnapshot = await getDocs(q);
        
        const userSurveys = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
    
        setSurveys(userSurveys);
      } catch (err) {
        console.log("Anketler çekilirken hata oluştu:", err);
      }
    };
  
    useEffect(() => {
      fetchUserSurveys();
    }, []);
  
    return (
      <>
        {surveys.length > 0 ? (
          surveys.map((survey) => <SurveyCard key={survey.id} survey={survey} />)
        ) : (
          <LoadingPage/>
        )}
      </>
    );
}

export default SurveyList;
