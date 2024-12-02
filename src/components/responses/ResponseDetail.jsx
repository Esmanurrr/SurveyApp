import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { BaseBackground, Container } from "../../style";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

function ResponseDetail() {
  const location = useLocation();
  const { title } = location.state || {}; // location.state'den gelen başlık (isteğe bağlı)
  const { id } = useParams();
  const [responses, setResponses] = useState([]); // Tüm yanıtlar burada tutulacak
  const [loading, setLoading] = useState(true);

  console.log(id);

  // Tüm `responses` koleksiyonunu çekmek için kullanılan fonksiyon
  const fetchSurveyResponses = async () => {
    const responsesRef = collection(db, "responses", id);
    const querySnapshot = await getDocs(responsesRef);

    const surveyResponses = [];
    querySnapshot.forEach((doc) => {
      surveyResponses.push({ id: doc.id, ...doc.data() });
    });

    return surveyResponses;
  };
  useEffect(() => {
    const getResponses = async () => {
      setLoading(true);
      try {
        const fetchedResponses = await fetchSurveyResponses();
        setResponses(fetchedResponses);
      } catch (error) {
        console.error("Veriler alınırken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    getResponses();
  }, []); // Bu useEffect sadece bileşen yüklendiğinde çalışır

  if (loading) return <p>Loading responses...</p>;

  return (
    <BaseBackground>
      <Container>
        <h2>{title || "Tüm Yanıtlar"}</h2>
        {responses.length > 0 ? (
          <ul>
            {responses.map((response) => (
              <li key={response.id}>
                <h3>Yanıt ID: {response.id}</h3>
                <h4>Anket Başlığı: {response.title}</h4>
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
              </li>
            ))}
          </ul>
        ) : (
          <p>Hiç yanıt bulunamadı.</p>
        )}
      </Container>
    </BaseBackground>
  );
}

export default ResponseDetail;
