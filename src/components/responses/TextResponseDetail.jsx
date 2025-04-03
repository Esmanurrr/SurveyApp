import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { BaseBackground, Container, Header } from "../../style";
import LoadingPage from "../infos/LoadingPage";
import { fetchSurveyResponsesAsync } from "../../redux/response/responseSlice";
import { fetchSurveyByQuestionIdAsync } from "../../redux/survey/surveySlice";
import { useAuth } from "../../contexts/authContext/index";
import { Link } from "react-router-dom";
import Pagination from "../common/Pagination";
import {
  selectCurrentPage,
  selectItemsPerPage,
  selectPaginatedData,
  setCurrentPage,
} from "../../redux/pagination/paginationSlice";

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

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

  const currentPage = useSelector(selectCurrentPage);
  const itemsPerPage = useSelector(selectItemsPerPage);

  const [textResponses, setTextResponses] = useState([]);

  useEffect(() => {
    dispatch(fetchSurveyByQuestionIdAsync(questionId));
  }, [questionId, dispatch]);

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

  const paginatedResponses = selectPaginatedData(
    textResponses,
    currentPage,
    itemsPerPage
  );
  const totalPages = Math.ceil(textResponses.length / itemsPerPage);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

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
          <HeaderContent>
            <HeaderTitle>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "0.5rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: "24px", height: "24px", color: "#4a9dec" }}
                >
                  <path d="M11.625 16.5a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75zm0 1.5a3.375 3.375 0 100-6.75 3.375 3.375 0 000 6.75z" />
                  <path
                    fillRule="evenodd"
                    d="M5.625 1.5H18.375C20.384 1.5 22 3.116 22 5.125V18.875C22 20.884 20.384 22.5 18.375 22.5H5.625C3.616 22.5 2 20.884 2 18.875V5.125C2 3.116 3.616 1.5 5.625 1.5ZM18.375 3H5.625C4.244 3 3 4.244 3 5.125V18.875C3 19.756 4.244 21 5.625 21H18.375C19.756 21 21 19.756 21 18.875V5.125C21 4.244 19.756 3 18.375 3Z"
                    clipRule="evenodd"
                  />
                </svg>
                <h1>{question.name}</h1>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <TimeStamp>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                  {currentSurvey?.title}
                </TimeStamp>
              </div>
            </HeaderTitle>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span
                style={{
                  background: "#4a9dec0d",
                  color: "#4a9dec",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: "16px", height: "16px" }}
                >
                  <path d="M11.625 16.5a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75zm0 1.5a3.375 3.375 0 100-6.75 3.375 3.375 0 000 6.75z" />
                  <path
                    fillRule="evenodd"
                    d="M5.625 1.5H18.375C20.384 1.5 22 3.116 22 5.125V18.875C22 20.884 20.384 22.5 18.375 22.5H5.625C3.616 22.5 2 20.884 2 18.875V5.125C2 3.116 3.616 1.5 5.625 1.5ZM18.375 3H5.625C4.244 3 3 4.244 3 5.125V18.875C3 19.756 4.244 21 5.625 21H18.375C19.756 21 21 19.756 21 18.875V5.125C21 4.244 19.756 3 18.375 3Z"
                    clipRule="evenodd"
                  />
                </svg>
                {textResponses.length} Responses
              </span>
            </div>
          </HeaderContent>
        </Container>
      </Header>
      <Container>
        {textResponses?.length > 0 ? (
          <>
            {paginatedResponses.map((response, index) => (
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
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ marginTop: "2rem" }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <NoResponses>No responses found for this question</NoResponses>
        )}
      </Container>
    </BaseBackground>
  );
}

export default TextResponseDetail;
