import { useState, useEffect } from "react";
import { Container, Span } from "../../style";
import AddQuestionButton from "./AddQuestionButton";
import QuestionCard from "./QuestionCard";
import axios from "axios";

function QuestionList({ surveyId }) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/surveys/${surveyId}`
        );
        setQuestions(response.data.questions);
      } catch (err) {
        console.error(err);
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
    <Container>
      {!questions.length && (
        <div>
          <h2>Lets add some questions to your survey</h2>
          <Span>Click the button below to get your survey up and running</Span>
          <AddQuestionButton />
        </div>
      )}
      {questions.length > 0 &&
        questions.map((question, index) => (
          <div key={index}>
            <h3>{index + 1}.</h3>
            <QuestionCard
            surveyId={surveyId}
            question={question}
            onQuestionDelete={handleQuestionDelete}
          />
          </div>
        ))}
      <AddQuestionButton />
    </Container>
  );
}

export default QuestionList;
