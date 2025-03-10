import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Answer,
  AnswerBadge,
  AnswerSection,
  BaseBackground,
  Container,
  ErrorMessage,
  Header,
  HeaderContent,
  HeaderTitle,
  MultipleAnswer,
  QuestionNumber,
  QuestionSection,
  QuestionText,
  ResponseCard,
  TimeStamp,
} from "../../style";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResponseByIdAsync,
  clearCurrentResponse,
} from "../../redux/response/responseSlice";
import LoadingPage from "../infos/LoadingPage";

const formatTimeAgo = (date) => {
  const now = new Date();
  const responseDate = new Date(date);
  const diffInSeconds = Math.floor((now - responseDate) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return responseDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function ResponseDetail() {
  const dispatch = useDispatch();
  const { responseId } = useParams();
  const { currentResponse, surveyTitle, loading, error } = useSelector(
    (state) => state.response
  );

  useEffect(() => {
    dispatch(fetchResponseByIdAsync(responseId));
    return () => {
      dispatch(clearCurrentResponse());
    };
  }, [dispatch, responseId]);

  if (loading) return <LoadingPage />;

  if (error || !currentResponse) {
    return (
      <ErrorMessage>
        <h3>{error || "Response not found"}</h3>
      </ErrorMessage>
    );
  }

  const renderAnswer = (question) => {
    if (Array.isArray(question.answer) && question.answer.length > 0) {
      return (
        <MultipleAnswer>
          {question.answer.map((ans, index) => (
            <AnswerBadge key={index}>{ans}</AnswerBadge>
          ))}
        </MultipleAnswer>
      );
    }

    if (question.answer) {
      return <Answer>{question.answer}</Answer>;
    }

    return <Answer className="unanswered">Unanswered</Answer>;
  };

  return (
    <BaseBackground>
      <Header>
        <Container>
          <HeaderContent>
            <HeaderTitle>
              <h1>{surveyTitle || "Survey Response"}</h1>
              <TimeStamp>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
                Submitted by Anonymous #{currentResponse.responderId}{" "}
                {formatTimeAgo(currentResponse.createdAt)}
              </TimeStamp>
            </HeaderTitle>
          </HeaderContent>
        </Container>
      </Header>
      <Container>
        {currentResponse.questions.map((question, i) => (
          <ResponseCard key={question.id}>
            <QuestionSection>
              <QuestionNumber>{i + 1}</QuestionNumber>
              <QuestionText>{question.name}</QuestionText>
            </QuestionSection>
            <AnswerSection>{renderAnswer(question)}</AnswerSection>
          </ResponseCard>
        ))}
      </Container>
    </BaseBackground>
  );
}

export default ResponseDetail;
