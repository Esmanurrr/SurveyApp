import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BaseWrapper,
  Container,
  Question,
  ShortDropdown,
  ShortInput,
  ShortTextarea,
  SubmitButton,
  SurveyDef,
  SurveyWrapper,
} from "../../style";
import { db } from "../../firebase/firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { createValidationSchema } from "../../validations/schemas/surveySchema";
import * as yup from "yup";
import SurveyComplete from "../infos/SurveyComplete";
import LoadingPage from "../infos/LoadingPage";
import { toast } from "react-toastify";

const FillSurvey = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const surveyRef = doc(db, "surveys", surveyId);
        const surveyDoc = await getDoc(surveyRef);

        if (surveyDoc.exists()) {
          const surveyData = surveyDoc.data();
          setSurvey(surveyData);

          const initialResponses = {};
          surveyData.questions.forEach((question) => {
            if (question.type === "Multiple Choice") {
              initialResponses[question.id] = []; 
            } else {
              initialResponses[question.id] = ""; 
            }
          });
          setResponses(initialResponses); 
        } else {
          toast.error("Survey cannot found.", { position: "top-right"});
        }
      } catch (error) {
        toast.error("Failed to fetch survey data::", { position: "top-right"});
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [surveyId]);

  if (loading) {
    return <LoadingPage/>;
  }

  if (!survey || !survey.questions) {
    return toast.error("Survey data is missing or corrupted.", { position: "top-right"});
  }

  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  };

  const getAnswer = (question, responses) => {
    const response = responses[question.id];
  
    if (Array.isArray(response)) {
      if (response.length === 0 && !question.canBeSkipped) {
        throw new Error(`${question.name} requires at least one option to be selected.`);
      }
      return response; 
    }
  
    if (response !== undefined && response !== null) {
      return response;
    }
  
    return question.canBeSkipped ? "Unanswered" : null; 
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationSchema = createValidationSchema(survey.questions);

    try {
      await validationSchema.validate(responses, { abortEarly: false });

      setError({});

      const formattedResponses = {
        title: survey.title,
        questions: survey.questions.map((question) => ({
          id: question.id,
          name: question.name,
          answer: getAnswer(question, responses),
          canBeSkipped: question.canBeSkipped || false,
        })),
      };

      const responsesRef = collection(db, "responses");
      await addDoc(responsesRef, {
        surveyId: surveyId,
        surveyOwnerId: survey.userId,
        ...formattedResponses,
      });
      toast.success("Responses saved", { position: "top-right"});
      
      setIsSubmitted(true);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setError(newErrors);
      } else {
        toast.error("Responses could not be added.", { position: "top-right"});
        
      }
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
          { isSubmitted ? <SurveyComplete /> : 
            <form onSubmit={handleSubmit}>
            {survey.questions.map((question, index) => (
              <div key={question.id}>
                <Question>
                  {index + 1}. {question.name}
                  {error[question.id] && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {error[question.id]}
                    </div>
                  )}
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
                            style={{margin:"5px"}}
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

            <SubmitButton type="submit">
              Submit
            </SubmitButton>
          </form>}
        </Container>
      </BaseWrapper>
    </SurveyWrapper>
  );
};

export default FillSurvey;
