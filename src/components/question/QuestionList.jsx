import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestionsAsync } from "../../redux/question/questionSlice";
import LoadingPage from "../infos/LoadingPage";
import QuestionCard from "./QuestionCard";
import AddQuestionButton from "./AddQuestionButton";
import styled from "styled-components";

const QuestionListContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;

  h2 {
    color: #2d3748;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: #718096;
    font-size: 1.1rem;
    line-height: 1.5;
  }
`;

const QuestionGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const QuestionCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  h3 {
    color: #2d3748;
    font-size: 1.2rem;
    font-weight: 500;
  }

  span {
    background: #4a9dec;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

function QuestionList({ surveyId }) {
  const dispatch = useDispatch();
  const { questions, loading } = useSelector((state) => state.question);

  useEffect(() => {
    dispatch(fetchQuestionsAsync(surveyId));
  }, [dispatch, surveyId]);

  if (loading) return <LoadingPage />;

  return (
    <QuestionListContainer>
      {!questions.length ? (
        <EmptyState>
          <h2>Let's add some questions to your survey</h2>
          <p>Click the button below to get your survey up and running</p>
          <AddQuestionButton />
        </EmptyState>
      ) : (
        <>
          <QuestionGrid>
            {questions.map((question, index) => (
              <QuestionCard
                surveyId={surveyId}
                key={question.id || index}
                index={index}
                question={question}
              />
            ))}
          </QuestionGrid>
          <AddQuestionButton />
        </>
      )}
    </QuestionListContainer>
  );
}

export default QuestionList;
