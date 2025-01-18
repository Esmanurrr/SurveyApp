import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Header,
  LinkButton,
  StyledButton,
} from "../../style";
import { toast } from "react-toastify";

const SurveyHeader = ({ title, description, id }) => {
  // Vercel'deki domain adresini kullan
  const shareableLink = `${window.location.origin}/survey/fill-survey/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    toast.success("Link copied to clipboard!", { position: "top-right" });
  };

  return (
    <Header>
      <Container>
        <h1>{title}</h1>
        <p>{description}</p>

        <LinkButton
          href={shareableLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Preview Survey
        </LinkButton>

        <StyledButton onClick={handleCopyLink}>
          Copy Shareable Link
        </StyledButton>
      </Container>
    </Header>
  );
};

export default SurveyHeader;
