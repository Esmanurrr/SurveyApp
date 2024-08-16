import { useNavigate } from "react-router-dom"; // useNavigate hook'unu import et
import { Container, Header } from "../../style";

const SurveyHeader = ({ title, description, id }) => {
  const navigate = useNavigate(); // useNavigate hook'u ile yönlendirme yapacağız

  // Butona tıklandığında fill-survey sayfasına yönlendirme yap
  const handleFillSurvey = () => {
    navigate(`/survey/fill-survey/${id}`); // Survey ID'yi path'te kullan
  };

  return (
    <>
      <Header>
        <Container>
          <span>Status</span>
          <h2>{title}</h2>
          <p>{description}</p>
          {/* "Fill the Survey" butonu */}
          <button 
            onClick={handleFillSurvey} 
            style={{
              backgroundColor: "#4CAF50", 
              color: "white", 
              padding: "10px 20px", 
              border: "none", 
              borderRadius: "5px", 
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            Fill the Survey
          </button>
        </Container>
      </Header>
    </>
  );
};

export default SurveyHeader;
