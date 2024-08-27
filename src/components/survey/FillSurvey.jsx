import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BaseWrapper, Container, Question, ShortDropdown, ShortInput, ShortTextarea, SubmitButton, SurveyDef, SurveyWrapper, Textarea } from "../../style";

const FillSurvey = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/surveys/${surveyId}`)
      .then((response) => {
        setSurvey(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Anket verisi çekilemedi:", error);
        setLoading(false);
      });
  }, [surveyId]);

  if (loading) {
    return <p>Loading survey...</p>;
  }

  if (!survey || !survey.questions) {
    return <p>Survey data is missing or corrupted.</p>;
  }

  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted responses:", responses);
  };

  return (
    <SurveyWrapper>
      <SurveyDef>
        <h1>{survey.title}</h1>
        <p>{survey.description}</p>
      </SurveyDef>
      <BaseWrapper>
        <Container>
          <form onSubmit={handleSubmit}>
            {survey.questions.map((question, index) => (
              <div key={question.id}>
                <Question>
                  {index+1}. {question.name}
                </Question>
                {question.type === "Single Choice" && (
                  <ShortDropdown
                    value={responses[question.id] || ""}
                    onChange={(e) =>
                      handleResponseChange(question.id, e.target.value)
                    }
                  >
                    <option value="">Bir seçenek seçin</option>
                    {question.options
                      .filter((option) => option !== "")
                      .map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                  </ShortDropdown>
                )}

                {question.type === "Multiple Choice" && (
                  <div>
                    {question.options
                      .filter((option) => option !== "")
                      .map((option) => (
                        <label key={option}>
                          <input
                            type="checkbox"
                            value={option}
                            checked={
                              responses[question.id]?.includes(option) || false
                            }
                            onChange={(e) => {
                              const selectedOptions =
                                responses[question.id] || [];
                              if (e.target.checked) {
                                handleResponseChange(question.id, [
                                  ...selectedOptions,
                                  option,
                                ]);
                              } else {
                                handleResponseChange(
                                  question.id,
                                  selectedOptions.filter((v) => v !== option)
                                );
                              }
                            }}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                  </div>
                )}

                {question.type === "Text Response" && (
                  <ShortInput
                    type="text"
                    placeholder="Cevabınızı girin"
                    value={responses[question.id] || ""}
                    onChange={(e) =>
                      handleResponseChange(question.id, e.target.value)
                    }
                  />
                )}

                {question.type === "Long Text Response" && (
                  <ShortTextarea
                    rows={4}
                    placeholder="Cevabınızı yazın"
                    value={responses[question.id] || ""}
                    onChange={(e) =>
                      handleResponseChange(question.id, e.target.value)
                    }
                  />
                )}
              </div>
            ))}

            <SubmitButton
              type="submit"
            >
              Submit
            </SubmitButton>
          </form>
        </Container>
      </BaseWrapper>
    </SurveyWrapper>
  );
};

export default FillSurvey;
