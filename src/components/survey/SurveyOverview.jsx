import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSurveyResponsesAsync } from "../../redux/response/responseSlice";
import styled from "styled-components";
import {
  CardContent,
  CardTitle,
  EmptyState,
  QuestionListContainer,
  ActionButton,
} from "../../style";
import { useAuth } from "../../contexts/authContext";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination";
import {
  selectCurrentPage,
  selectItemsPerPage,
  selectPaginatedData,
  setCurrentPage,
} from "../../redux/pagination/paginationSlice";

const HorizontalCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 800px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ProgressBar = styled.div`
  width: ${(props) => props.width}%;
  height: 8px;
  background-color: #4a9dec;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  margin: 8px 0;
`;

const OptionContainer = styled.div`
  margin: 12px 0;
`;

const OptionLabel = styled.div`
  display: flex;
  justify-content: space-between;
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 4px;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const QuestionNumber = styled.span`
  color: #4a9dec;
  font-weight: 600;
  margin-right: 8px;
`;

const TextResponseNote = styled.div`
  background-color: #f8fafc;
  padding: 12px;
  border-radius: 4px;
  color: #718096;
  font-size: 0.9rem;
  margin-top: 8px;
  border-left: 3px solid #4a9dec;
`;

const SummaryButton = styled.button`
  background: #4a9dec;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #3182ce;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
    color: #2d3748;
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #4a5568;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ResponseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResponseItem = styled.div`
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  p {
    margin: 0;
    color: #4a5568;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    color: #718096;
    font-size: 0.8rem;

    a {
      color: #4a9dec;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: #2c5282;
        text-decoration: underline;
      }
    }
  }

  .timestamp {
    color: #718096;
    font-size: 0.8rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const SeeMoreButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #4a9dec;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #3182ce;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SurveyOverview = ({ surveyId }) => {
  const [questionStats, setQuestionStats] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { responses, loading } = useSelector((state) => state.response);
  const { currentSurvey } = useSelector((state) => state.survey);
  const navigate = useNavigate();

  const currentPage = useSelector(selectCurrentPage);
  const itemsPerPage = useSelector(selectItemsPerPage);

  useEffect(() => {
    if (surveyId && user) {
      dispatch(fetchSurveyResponsesAsync({ surveyId, userId: user.uid }));
    }
  }, [surveyId, user, dispatch]);

  useEffect(() => {
    if (responses?.length > 0 && currentSurvey?.questions?.length > 0) {
      const stats = currentSurvey.questions.map((question, index) => {
        if (
          question.type === "Text Response" ||
          question.type === "Long Text Response"
        ) {
          return {
            ...question,
            questionNumber: index + 1,
            isTextResponse: true,
          };
        }

        const optionCounts = {};
        responses.forEach((response) => {
          const answer = response.questions?.find(
            (q) => q.id === question.id
          )?.answer;

          if (answer) {
            if (Array.isArray(answer)) {
              answer.forEach((ans) => {
                optionCounts[ans] = (optionCounts[ans] || 0) + 1;
              });
            } else {
              optionCounts[answer] = (optionCounts[answer] || 0) + 1;
            }
          }
        });

        const optionStats = question.options.map((option) => ({
          option,
          count: optionCounts[option] || 0,
          percentage: ((optionCounts[option] || 0) / responses.length) * 100,
        }));

        return {
          ...question,
          questionNumber: index + 1,
          isTextResponse: false,
          optionStats,
        };
      });

      setQuestionStats(stats);
    }
  }, [responses, currentSurvey?.questions]);

  const paginatedQuestionStats = selectPaginatedData(
    questionStats,
    currentPage,
    itemsPerPage
  );
  const totalPages = Math.ceil(questionStats.length / itemsPerPage);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleShowSummary = (question) => {
    const questionResponses = responses
      .map((response) => {
        const questionResponse = response.questions.find(
          (q) => q.id === question.id
        );
        if (questionResponse?.answer) {
          return {
            id: response.id,
            answer: Array.isArray(questionResponse.answer)
              ? questionResponse.answer.join(", ")
              : questionResponse.answer,
            timestamp: response.createdAt,
            responderId: response.responderId,
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setSelectedQuestion({
      ...question,
      responses: questionResponses,
    });
    setShowModal(true);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return "Date not available";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSeeMoreClick = () => {
    setShowModal(false);
    if (selectedQuestion?.isTextResponse) {
      navigate(`/text-response/${selectedQuestion.id}`, {
        state: {
          question: selectedQuestion,
          responses: responses,
          surveyId: currentSurvey?.id,
          currentSurvey: currentSurvey,
        },
      });
    } else {
      navigate(`/survey/${currentSurvey?.id}`, {
        state: { activeTab: "responses" },
      });
    }
  };

  if (loading) {
    return (
      <QuestionListContainer>
        <EmptyState>
          <h2>Loading survey statistics...</h2>
          <p>Please wait while we fetch the data.</p>
        </EmptyState>
      </QuestionListContainer>
    );
  }

  if (!questionStats.length) {
    return (
      <QuestionListContainer>
        <EmptyState>
          <h2>No questions found</h2>
          <p>Add some questions to your survey to see responses here.</p>
          <ActionButton as={Link} to={`/survey/${surveyId}/edit`} $primary>
            Add Questions
          </ActionButton>
        </EmptyState>
      </QuestionListContainer>
    );
  }

  return (
    <StatsContainer>
      {paginatedQuestionStats.map((question) => (
        <HorizontalCard key={question.id}>
          <CardContent>
            <CardHeader>
              <CardTitle>
                <QuestionNumber>{question.questionNumber}.</QuestionNumber>
                {question.name}
              </CardTitle>
              <SummaryButton onClick={() => handleShowSummary(question)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                </svg>
                View Responses
              </SummaryButton>
            </CardHeader>
            {question.isTextResponse ? (
              <TextResponseNote>
                This is a text response question. Click &quot;View
                Responses&quot; to see recent answers.
              </TextResponseNote>
            ) : (
              <div style={{ marginTop: "1rem" }}>
                {question.optionStats.map((option) => (
                  <OptionContainer key={option.option}>
                    <OptionLabel>
                      <span>{option.option}</span>
                      <span>{option.count} responses</span>
                    </OptionLabel>
                    <ProgressBarContainer>
                      <ProgressBar width={option.percentage} />
                    </ProgressBarContainer>
                  </OptionContainer>
                ))}
              </div>
            )}
          </CardContent>
        </HorizontalCard>
      ))}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {showModal &&
        createPortal(
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <h2>{selectedQuestion?.name}</h2>
                <CloseButton onClick={() => setShowModal(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </CloseButton>
              </ModalHeader>
              <ResponseList>
                {selectedQuestion?.responses?.slice(0, 4).map((response) => (
                  <ResponseItem key={response.id}>
                    <p>{response.answer}</p>
                    <div className="meta">
                      <Link to={`/response/${response.id}`}>
                        Anonymous #{response.responderId}
                      </Link>
                      <div className="timestamp">
                        {formatDate(response.timestamp)}
                      </div>
                    </div>
                  </ResponseItem>
                ))}
              </ResponseList>
              <SeeMoreButton onClick={handleSeeMoreClick}>
                <span>See All Responses</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </SeeMoreButton>
            </ModalContent>
          </ModalOverlay>,
          document.body
        )}
    </StatsContainer>
  );
};

export default SurveyOverview;
