import { useState, useEffect } from "react";
import { BaseBackground, Container, Span, TextCenter } from "../../style";
import AddQuestionButton from "./AddQuestionButton";
import QuestionCard from "./QuestionCard";
import { db } from "../../firebase";
import { collection, doc, getDoc } from "firebase/firestore";

function QuestionList({ surveyId }) {
  const [questions, setQuestions] = useState([]);

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
          
          if (surveyData.questions) {
            setQuestions(surveyData.questions); // Eğer questions varsa ayarla
          } else {
            console.log("Questions alanı bulunamadı.");
          }
        } else {
          console.log("Belge bulunamadı!");
        }
      } catch (err) {
        console.error("Veri çekme hatası: ", err);
      }
    };

    fetchData();
  }, [surveyId]);

  const handleQuestionDelete = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.id !== questionId)
    );
  };

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
