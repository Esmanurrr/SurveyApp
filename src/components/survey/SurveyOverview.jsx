import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { CardContent, CardTitle } from "../../style";
import PropTypes from "prop-types";

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
  const { responses } = useSelector((state) => state.response);
  const { currentSurvey } = useSelector((state) => state.survey);

  useEffect(() => {
    if (responses && currentSurvey) {
      // Tüm soruları işle
      const stats = currentSurvey.questions?.map((question, index) => {
        const isChoiceQuestion =
          question.type === "Single Choice" ||
          question.type === "Multiple Choice";

        const optionCounts = {};
        let totalResponses = 0;

        if (isChoiceQuestion) {
          // Her seçenek için başlangıç değeri
          question.options.forEach((option) => {
            optionCounts[option] = 0;
          });

          // Yanıtları say
          responses.forEach((response) => {
            const questionResponse = response.questions.find(
              (q) => q.id === question.id
            );
            if (questionResponse) {
              if (Array.isArray(questionResponse.answer)) {
                // Multiple Choice için
                questionResponse.answer.forEach((answer) => {
                  optionCounts[answer] = (optionCounts[answer] || 0) + 1;
                  totalResponses++;
                });
              } else {
                // Single Choice için
                optionCounts[questionResponse.answer] =
                  (optionCounts[questionResponse.answer] || 0) + 1;
                totalResponses++;
              }
            }
          });
        }

        // Yüzdeleri hesapla
        const optionStats = Object.entries(optionCounts).map(
          ([option, count]) => ({
            option,
            count,
            percentage: totalResponses ? (count / totalResponses) * 100 : 0,
          })
        );

        return {
          questionId: question.id,
          questionNumber: index + 1,
          questionName: question.name,
          type: question.type,
          isChoiceQuestion,
          options: optionStats,
          totalResponses,
        };
      });

      setQuestionStats(stats || []);
    }
  }, [responses, currentSurvey]);

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
              {question.questionName}
            </CardTitle>
            {question.isChoiceQuestion ? (
              <div style={{ marginTop: "1rem" }}>
                {question.options.map((option) => (
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
            ) : (
              <TextResponseNote>
                This is a text response question. Response statistics are not
                available for this type of question.
              </TextResponseNote>
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
