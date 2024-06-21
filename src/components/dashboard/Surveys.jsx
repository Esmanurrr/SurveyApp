import { useState } from "react"
import { Container, FlexContainer, RelativeDiv } from "../../style";
import CreateSurveyModal from "./CreateSurveyModal";
import { createPortal } from 'react-dom';
import CreateSurvey from "./CreateSurvey";
import SurveyList from "./SurveyList";

function Surveys() {
  const [portal, setPortal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePortal = async () => {
    try {
      setLoading(true);
      setPortal(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const closePortal = () => {
    setPortal(false);
  }


  return (
    <>
        <Container>
          <RelativeDiv>
              {
                !loading && 
                <FlexContainer>
                  <div style={{flexGrow: 1}}>
                    <SurveyList/>
                  </div>
                  <div style={{flexShrink: 0, marginTop: "1rem"}}>
                  <CreateSurvey handlePortal={handlePortal} />
                  {portal && createPortal(<CreateSurveyModal closePortal={closePortal}/>, document.body)}
                  </div>
                </FlexContainer>
              }
          </RelativeDiv>
        </Container>
    </>
  )
}

export default Surveys