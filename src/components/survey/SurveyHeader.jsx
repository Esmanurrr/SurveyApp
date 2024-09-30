import { useNavigate } from "react-router-dom";
import { Button, Container, Header } from "../../style";

const SurveyHeader = ({ title, description, id }) => {
  const navigate = useNavigate();
  const handleFillSurvey = () => {
    navigate(`/survey/fill-survey/${id}`);
  };

  return (
    <>
      <Header>
        <Container>
          <span>Status</span>
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
        </Container>
      </Header>
    </>
  );
};

export default SurveyHeader;
