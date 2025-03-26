import PropTypes from "prop-types";
import {
  Container,
  Header,
  HeaderContent,
  HeaderTitle,
  LinkButton,
  StyledButton,
} from "../../style";
import { toast } from "react-toastify";

const SurveyHeader = ({ title, description, id }) => {
  const shareableLink = `${window.location.origin}/survey/fill-survey/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    toast.success("Link copied to clipboard!", { position: "top-right" });
  };

  return (
    <Header>
      <Container>
        <HeaderContent>
          <HeaderTitle>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: "24px", height: "24px", color: "#4a9dec" }}
              >
                <path d="M11.625 16.5a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75zm0 1.5a3.375 3.375 0 100-6.75 3.375 3.375 0 000 6.75z" />
                <path
                  fillRule="evenodd"
                  d="M5.625 1.5H18.375C20.384 1.5 22 3.116 22 5.125V18.875C22 20.884 20.384 22.5 18.375 22.5H5.625C3.616 22.5 2 20.884 2 18.875V5.125C2 3.116 3.616 1.5 5.625 1.5ZM18.375 3H5.625C4.244 3 3 4.244 3 5.125V18.875C3 19.756 4.244 21 5.625 21H18.375C19.756 21 21 19.756 21 18.875V5.125C21 4.244 19.756 3 18.375 3Z"
                  clipRule="evenodd"
                />
              </svg>
              <h1>{title}</h1>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <p style={{ color: "#718096", margin: 0 }}>{description}</p>
            </div>
          </HeaderTitle>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <LinkButton
              href={shareableLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#4a9dec0d",
                color: "#4a9dec",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: "16px", height: "16px" }}
              >
                <path d="M21 13v7a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h7v2H5v14h14v-6h2zm3-8h-6V4h6v1z" />
              </svg>
              Open Survey
            </LinkButton>
            <StyledButton
              onClick={handleCopyLink}
              style={{
                background: "#4a9dec",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: "16px", height: "16px" }}
              >
                <path d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z" />
                <path d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2" />
              </svg>
              Copy Shareable Link
            </StyledButton>
          </div>
        </HeaderContent>
      </Container>
    </Header>
  );
};

SurveyHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default SurveyHeader;
