import { useLocation, useParams } from "react-router-dom";
import { Container, Header } from "../../style";

const SurveyHeader = ({title, description, id}) => {


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
