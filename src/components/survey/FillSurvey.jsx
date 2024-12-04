import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BaseWrapper, Container, Question, ShortDropdown, ShortInput, ShortTextarea, SubmitButton, SurveyDef, SurveyWrapper, Textarea } from "../../style";
import { db } from "../../firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";

const FillSurvey = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const surveyRef = doc(db, "surveys", surveyId);
        const surveyDoc = await getDoc(surveyRef);

        if (surveyDoc.exists()) {
          setSurvey(surveyDoc.data());
        } else {
          console.log("Anket bulunamadı!");
        }
      } catch (error) {
        console.error("Anket verisi çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedResponses = {
      title: survey.title,
      questions: survey.questions.map((question) => ({
        id: question.id,
        name: question.name,
        answer: Array.isArray(responses[question.id])
          ? responses[question.id] 
          : [responses[question.id]], 
      })),
    };
  
    try {
      const responsesRef = collection(db, "responses");
      await addDoc(responsesRef, {
        surveyId: surveyId,
        ...formattedResponses, 
      });
      console.log("Yanıtlar başarıyla kaydedildi:", formattedResponses);
      navigate(`/responses`, { state: { surveyId } });
    } catch (error) {
      console.log("Yanıtlar kaydedilemedi:", error);
    }
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
                    <option value="">Select an option</option>
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
              navigate='/responses'
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
