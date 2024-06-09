import { useLocation } from "react-router-dom";
import { Container } from "../../style";

const SurveyHeader = () => {
  const location = useLocation();
  const { title, description } = location.state || {
    title: "",
    description: "",
  };

  return (
    <>
      <Container>
        <h2>{title}</h2>
        <p>{description}</p>
      </Container>
    </>
  );
};

export default SurveyHeader;
