import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { BaseBackground, Container } from "../../style";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import LoadingPage from "../infos/LoadingPage";

function ResponseDetail() {
  const location = useLocation();
  const { title } = location.state || {}; 
  const [response, setResponse] = useState(null); 
  const [loading, setLoading] = useState(true);
  const { responseId } = useParams();

  useEffect(() => {
    const fetchResponse = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "responses", responseId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setResponse({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Belge bulunamadı!");
        }
      } catch (error) {
        console.error("Yanıt alınırken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [responseId]); 

  if (loading) return <LoadingPage/>;

  return (
    <BaseBackground>
    <Container>
      <h2>{title}</h2>
      <ul>
        {response.questions.map((question) => (
          <li key={question.id}>
            <p>
              <strong>Soru:</strong> {question.name}
            </p>
            <p>
              <strong>Yanıt:</strong> {question.answer.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </Container>
  </BaseBackground>
  );
}

export default ResponseDetail;
