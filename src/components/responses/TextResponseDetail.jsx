import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { BaseBackground, Container, Header } from "../../style";
import LoadingPage from "../infos/LoadingPage";
import { fetchSurveyResponsesAsync } from "../../redux/response/responseSlice";
import { fetchSurveyByQuestionIdAsync } from "../../redux/survey/surveySlice";
import { useAuth } from "../../contexts/authContext";
import { Link } from "react-router-dom";

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

const ResponseContent = styled.div`
  padding: 1.5rem;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResponseText = styled.p`
  margin: 0;
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.6;
`;

const ResponseMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-size: 0.9rem;

  svg {
    width: 16px;
    height: 16px;
  }

  a {
    color: #4a9dec;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #2c5282;
      text-decoration: underline;
    }
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

const NoResponses = styled.div`
  text-align: center;
  padding: 2rem;
  color: #718096;
  background: white;
  border-radius: 12px;
  margin-top: 1rem;
`;

function TextResponseDetail() {
  const { questionId: encodedQuestionId } = useParams();
  const questionId = decodeURIComponent(encodedQuestionId);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { responses, loading: responsesLoading } = useSelector(
    (state) => state.response
  );
  const { currentSurvey, loading: surveyLoading } = useSelector(
    (state) => state.survey
  );

  const [textResponses, setTextResponses] = useState([]);

  // 1. Önce survey'i fetch et
  useEffect(() => {
    dispatch(fetchSurveyByQuestionIdAsync(questionId));
  }, [questionId, dispatch]);

  // 2. Survey geldiğinde responses'ları fetch et
  useEffect(() => {
    if (currentSurvey?.id && user) {
      console.log("Fetching responses for:", {
        surveyId: currentSurvey.id,
        userId: user.uid,
        questionId,
      });
      dispatch(
        fetchSurveyResponsesAsync({
          surveyId: currentSurvey.id,
          userId: user.uid,
        })
      );
    }
  }, [currentSurvey?.id, user, dispatch]);

  // 3. Responses geldiğinde işle
  useEffect(() => {
    if (responses?.length > 0) {
      const filteredResponses = responses
        .map((response) => {
          const questionResponse = response.questions?.find(
            (q) => q.id === questionId
          );
          if (questionResponse?.answer) {
            return {
              id: response.id,
              answer: questionResponse.answer,
              timestamp: response.createdAt,
              responderId: response.responderId,
            };
          }
          return null;
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setTextResponses(filteredResponses);
    }
  }, [responses, questionId]);

  const question = currentSurvey?.questions?.find((q) => q.id === questionId);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (surveyLoading || responsesLoading) return <LoadingPage />;

  if (!question) {
    return (
      <BaseBackground>
        <Container>
          <NoResponses>Question not found</NoResponses>
        </Container>
      </BaseBackground>
    );
  }

  return (
    <BaseBackground>
      <Header>
        <Container>
          <h1>{question.name}</h1>
        </Container>
      </Header>
      <Container>
        {textResponses?.length > 0 ? (
          textResponses.map((response, index) => (
            <ResponseCard key={index}>
              <ResponseContent>
                <ResponseText>{response.answer}</ResponseText>
              </ResponseContent>
              <ResponseMeta>
                <UserInfo>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Link to={`/response/${response.id}`}>
                    Anonymous #{response.responderId}
                  </Link>
                </UserInfo>
                <TimeStamp>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formatDate(response.timestamp)}
                </TimeStamp>
              </ResponseMeta>
            </ResponseCard>
          ))
        ) : (
          <NoResponses>No responses found for this question</NoResponses>
        )}
      </Container>
    </BaseBackground>
  );
}

export default TextResponseDetail;
