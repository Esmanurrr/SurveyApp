import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import ResponseSurveyCard from "./ResponseSurveyCard";
import LoadingPage from "../infos/LoadingPage";

function ResponseList() {
  const location = useLocation();
  const [responsesList, setResponsesList] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const q = query(collection(db, "responses"));
        const querySnapshot = await getDocs(q);
        const fetchedResponses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setResponsesList(fetchedResponses);
      } catch (error) {
        console.log("yanıtlar alınamadı: ", error);
      }
    };

    fetchResponses();
  }, []);

  return (
    <>
      {responsesList.length > 0 ? (
        responsesList.map((response) => (
          <ResponseSurveyCard
            key={response.id}
            id={response.id}
            title={response.title}
          />
        ))
      ) : (
        <LoadingPage />
      )}
    </>
  );
}

export default ResponseList;
