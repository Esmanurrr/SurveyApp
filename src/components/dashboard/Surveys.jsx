import { useState } from "react"
import { Container, RelativeDiv } from "../../style";
import CreateSurveyModal from "./CreateSurveyModal";
import { createPortal } from 'react-dom';
import CreateSurvey from "./CreateSurvey";

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
                <>
                  <CreateSurvey handlePortal={handlePortal} />
                  {portal && createPortal(<CreateSurveyModal closePortal={closePortal}/>, document.body)}
                </>
              }
          </RelativeDiv>
        </Container>
    </>
  )
}

export default Surveys