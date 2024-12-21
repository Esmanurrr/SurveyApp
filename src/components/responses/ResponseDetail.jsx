import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  BaseBackground,
  Card,
  CardWrapper,
  Container,
  Header,
  TextCenter,
} from "../../style";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
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

  if (loading) return <LoadingPage />;

  return (
    <BaseBackground>
      <Header>
        <Container>
          <h1>{title}</h1>
        </Container>
      </Header>
      <Container>
        <CardWrapper>
          {response.questions.map((question, i) => (
            <Card
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "0px",
              }}
              key={question.id}
            >
              <div style={{ padding: "1.5rem" }}>
                <p>
                  <strong>{i + 1}.</strong> {question.name}
                </p>
              </div>
              <hr style={{ border: "1px solid #ddd" }} />
              <div style={{ padding: "1.5rem" }}>
                <p>
                  {Array.isArray(question.answer)
                    ? question.answer.length > 0
                      ? question.answer.join(" , ") // Eğer array doluysa birleştir ve yazdır
                      : "Unanswered" // Eğer array boşsa "Unanswered"
                    : question.answer
                    ? question.answer // Tekli cevap varsa yazdır
                    : "Unanswered"}{" "}
                </p>
              </div>
            </Card>
          ))}
        </CardWrapper>
      </Container>
    </BaseBackground>
  );
}

export default ResponseDetail;
