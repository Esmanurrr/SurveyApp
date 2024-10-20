import { useState, useEffect } from "react";
import { BaseBackground, Container, Span, TextCenter } from "../../style";
import AddQuestionButton from "./AddQuestionButton";
import QuestionCard from "./QuestionCard";
import { db } from "../../firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import LoadingPage from "../infos/LoadingPage";

function QuestionList({ surveyId }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Belge referansı al
        console.log(surveyId);
        const surveyRef = doc(db, "surveys", surveyId);
        // Belgeden veriyi al
        const surveyDoc = await getDoc(surveyRef);
        
        if (surveyDoc.exists()) {
          const surveyData = surveyDoc.data();
          console.log("Anket verisi: ", surveyData); // Veriyi kontrol etmek için ekledim
          setLoading(false);
          if (surveyData.questions) {
            setQuestions(surveyData.questions); // Eğer questions varsa ayarla
          } else {
            console.log("Questions alanı bulunamadı.");
          }
        } else {
          console.log("Belge bulunamadı!");
          setLoading(true);
        }
      } catch (err) {
        console.error("Veri çekme hatası: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [surveyId]);

  const handleQuestionDelete = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.id !== questionId)
    );
  };

  if(loading) return <LoadingPage/>;

  return (
    <BaseBackground>
      <Container>
        {!questions.length && (
          <TextCenter>
            <h2>Lets add some questions to your survey</h2>
            <Span>
              Click the button below to get your survey up and running
            </Span>
            {/* <AddQuestionButton /> */}
          </TextCenter>
        )}
        {questions.length > 0 &&
          questions.map((question, index) => (
            <QuestionCard
              surveyId={surveyId}
              key={question.id}
              index={index}
              question={question}
              onQuestionDelete={handleQuestionDelete}
            />
          ))}
        <AddQuestionButton />
      </Container>
    </BaseBackground>
  );
}

export default QuestionList;
