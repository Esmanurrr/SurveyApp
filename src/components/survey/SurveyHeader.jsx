import { useLocation, useParams } from "react-router-dom";
import { Container } from "../../style";

const SurveyHeader = () => {
  const location = useLocation();
  const { title, description } = location.state || {
    title: "",
    description: "",
  };

  const {id} = useParams();
  console.log(id);

  return (
    <>
      <Container>
        <span>Status</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </Container>
    </>
  );
};

export default SurveyHeader;
