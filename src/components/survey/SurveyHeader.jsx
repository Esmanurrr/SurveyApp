import { useLocation, useParams } from "react-router-dom";
import { Container, Header } from "../../style";

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
    <Header>
      <Container>
        <span>Status</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </Container>
    </Header>
    </>
  );
};

export default SurveyHeader;
