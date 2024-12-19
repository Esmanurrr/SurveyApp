import { useNavigate } from "react-router-dom";
import { Button, Container, Header } from "../../style";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const SurveyHeader = ({ title, description, id }) => {
  const navigate = useNavigate();
  const handleFillSurvey = () => {
    navigate(`/survey/fill-survey/${id}`);
  };

  const activateSurvey = async (surveyId) => {
    try {
      const surveyRef = doc(db, "surveys", surveyId);
      await updateDoc(surveyRef, {
        isActive: true,
      });
      console.log("Survey activated!");
    } catch (error) {
      console.error("Error activating survey:", error);
    }
  };

  const shareableLink = `${window.location.origin}/survey/fill-survey/${id}`;

  return (
    <>
      <Header>
        <Container>
          <h1>{title}</h1>
          <p>{description}</p>
          <Button
            onClick={handleFillSurvey}
            style={{
              color: "white",
              padding: "1rem 1.5rem",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Fill the Survey
          </Button>
          <button onClick={() => activateSurvey(id)}>Activate Survey</button>
          <p>
            Share this link: <a href={shareableLink}>{shareableLink}</a>
          </p>
          <button onClick={() => navigator.clipboard.writeText(shareableLink)}>
            Copy Link
          </button>
        </Container>
      </Header>
    </>
  );
};

export default SurveyHeader;
