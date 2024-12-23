import { Container, TextCenter } from "../../style"

function SurveyComplete() {
  return (
    <Container>
    <TextCenter>
      <i className="fa-regular fa-circle-check fa-2xl" style={{color: "#0071e2", margin: "1rem"}}></i>
      <h3>Survey is completed. Thank you!</h3>
      <p>You can close the window.</p>
    </TextCenter>
    </Container>
  )
}

export default SurveyComplete