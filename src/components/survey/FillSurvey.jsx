import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Checkbox, Container, Dropdown, Flex, InputRes, Question, SurveyDef, SurveyWrapper, Textarea } from "../../style";

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
      <div>
        <Container>
          <form onSubmit={handleSubmit}>
            {survey.questions.map((question, index) => (
              <div key={question.id}>
                <Question>
                  {index+1}. {question.name}
                </Question>
                {question.type === "Single Choice" && (
                  <Dropdown
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
                  </Dropdown>
                )}

                {question.type === "Multiple Choice" && (
                  <div>
                    {question.options
                      .filter((option) => option !== "")
                      .map((option) => (
                        <label key={option} className="mb-1">
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
                          {option}
                        </label>
                      ))}
                  </div>
                )}

                {question.type === "Text Response" && (
                  <InputRes
                    type="text"
                    placeholder="Cevabınızı girin"
                    value={responses[question.id] || ""}
                    onChange={(e) =>
                      handleResponseChange(question.id, e.target.value)
                    }
                  />
                )}

                {question.type === "Long Text Response" && (
                  <Textarea
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

            <button
              type="submit"
            >
              Submit
            </button>
          </form>
        </Container>
      </div>
    </SurveyWrapper>
  );
};

export default FillSurvey;
