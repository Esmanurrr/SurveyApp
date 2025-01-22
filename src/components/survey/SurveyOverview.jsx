import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSurveyResponsesAsync } from "../../redux/response/responseSlice";
import styled from "styled-components";
import { CardContent, CardTitle } from "../../style";
import PropTypes from "prop-types";
import { useAuth } from "../../contexts/authContext";

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

const SurveyOverview = ({ surveyId }) => {
  const [questionStats, setQuestionStats] = useState([]);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { responses, loading } = useSelector((state) => state.response);
  const { currentSurvey } = useSelector((state) => state.survey);

  // Fetch responses when component mounts
  useEffect(() => {
    console.log("First useEffect - Conditions:", { surveyId, user });
    if (surveyId && user) {
      console.log("Fetching responses...");
      dispatch(fetchSurveyResponsesAsync({ surveyId, userId: user.uid }));
    }
  }, [surveyId, user, dispatch]);

  useEffect(() => {
    // Only calculate stats when both responses and questions are available
    if (responses?.length > 0 && currentSurvey?.questions?.length > 0) {
      console.log("Calculating statistics with:", {
        responsesCount: responses.length,
        questionsCount: currentSurvey.questions.length,
      });

      const stats = currentSurvey.questions.map((question, index) => {
        // Skip calculation for text responses
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

        // Calculate option selection rates for multiple choice questions
        const optionCounts = {};
        responses.forEach((response) => {
          // Response yapısını kontrol et ve log'la
          console.log("Processing response:", response);

          const answer = response.questions?.find(
            (q) => q.id === question.id
          )?.answer;

          if (answer) {
            // Eğer cevap bir array ise (Multiple Choice)
            if (Array.isArray(answer)) {
              answer.forEach((ans) => {
                optionCounts[ans] = (optionCounts[ans] || 0) + 1;
              });
            } else {
              // Tek cevap (Single Choice)
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

      console.log("Setting statistics:", stats);
      setQuestionStats(stats);
    }
  }, [responses, currentSurvey?.questions]);

  if (loading) {
    console.log("Component is in loading state");
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#718096" }}>
        Loading survey statistics...
      </div>
    );
  }

  if (!questionStats.length) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#718096" }}>
        No questions found in this survey.
      </div>
    );
  }

  return (
    <StatsContainer>
      {questionStats.map((question) => (
        <HorizontalCard key={question.questionId}>
          <CardContent>
            <CardTitle>
              <QuestionNumber>{question.questionNumber}.</QuestionNumber>
              {question.name}
            </CardTitle>
            {question.isTextResponse ? (
              <TextResponseNote>
                This is a text response question. Response statistics are not
                available for this type of question.
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
    </StatsContainer>
  );
};

SurveyOverview.propTypes = {
  surveyId: PropTypes.string.isRequired,
};

export default SurveyOverview;
