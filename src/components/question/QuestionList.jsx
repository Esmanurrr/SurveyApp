import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestionsAsync } from "../../redux/question/questionSlice";
import LoadingPage from "../infos/LoadingPage";
import QuestionCard from "./QuestionCard";
import AddQuestionButton from "./AddQuestionButton";
import { BaseBackground, Container, Span, TextCenter } from "../../style";

function QuestionList({ surveyId }) {
  const dispatch = useDispatch();
  const { questions, loading } = useSelector((state) => state.question);

  useEffect(() => {
    dispatch(fetchQuestionsAsync(surveyId));
  }, [dispatch, surveyId]);

  if (loading) return <LoadingPage />;

  return (
    <BaseBackground>
      <Container>
        {!questions.length && (
          <TextCenter>
            <h2>Let's add some questions to your survey</h2>
            <Span>
              Click the button below to get your survey up and running
            </Span>
          </TextCenter>
        )}
        {questions.length > 0 &&
          questions.map((question, index) => (
            <QuestionCard
              surveyId={surveyId}
              key={question.id || index}
              index={index}
              question={question}
            />
          ))}
        <AddQuestionButton />
      </Container>
    </BaseBackground>
  );
}

export default QuestionList;
