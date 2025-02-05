import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BaseBackground, Container, Header } from "../../style";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResponseByIdAsync,
  clearCurrentResponse,
} from "../../redux/response/responseSlice";
import LoadingPage from "../infos/LoadingPage";
import styled from "styled-components";

const ResponseCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    transform: translateY(-2px);
  }
`;

const QuestionSection = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: white;
  display: flex;
  align-items: center;
`;

const QuestionNumber = styled.span`
  color: #4a9dec;
  font-weight: 600;
  margin-right: 0.75rem;
  background: #4a9dec0d;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.9rem;
  border: 1px solid #e2e8f0;
`;

const QuestionText = styled.span`
  color: #2d3748;
  font-weight: 500;
  font-size: 1.1rem;
`;

const AnswerSection = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
`;

const Answer = styled.div`
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.5;

  &.unanswered {
    color: #a0aec0;
    font-style: italic;
  }
`;

const MultipleAnswer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const AnswerBadge = styled.span`
  background: white;
  color: #4a5568;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #2d3748;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.div`
  h1 {
    margin: 0;
    margin-bottom: 0.25rem;
  }
`;

const TimeStamp = styled.div`
  color: #718096;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 16px;
    height: 16px;
  }
`;

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
