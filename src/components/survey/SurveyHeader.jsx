import { useNavigate } from "react-router-dom";
import { Button, Container, Header, LinkButton, StyledButton } from "../../style";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const SurveyHeader = ({ title, description, id }) => {

  const shareableLink = `${window.location.origin}/survey/fill-survey/${id}`;

  return (
    <>
   <Header>
      <Container>
        <h1>{title}</h1>
        <p>{description}</p>

        <LinkButton href={shareableLink} target="_blank">
          Open Shareable Link
        </LinkButton>

        <StyledButton
          onClick={() => navigator.clipboard.writeText(shareableLink)}
        >
          Copy Link
        </StyledButton>
      </Container>
    </Header>
    </>
  );
};

export default SurveyHeader;
