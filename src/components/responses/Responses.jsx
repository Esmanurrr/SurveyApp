import { useState } from "react";
import {
  BaseBackground,
  Container,
  FlexContainer,
  RelativeDiv,
} from "../../style";
import CreateSurvey from "../dashboard/CreateSurvey";
import CreateSurveyModal from "../dashboard/CreateSurveyModal";
import { createPortal } from "react-dom";
import ResponseList from "./ResponseList";

function Responses() {
  const [portal, setPortal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePortal = async () => {
    setLoading(true);
    try {
      setPortal(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const closePortal = () => {
    setPortal(false);
  };

  return (
    <BaseBackground>
      <Container>
        <h1>Responses</h1>
        <RelativeDiv>
          {!loading && (
            <FlexContainer>
              <div style={{ flexGrow: 1 }}>
                <ResponseList />
              </div>
              <div style={{ flexShrink: 0, marginTop: "1rem" }}>
                <CreateSurvey handlePortal={handlePortal} />
                {portal &&
                  createPortal(
                    <CreateSurveyModal closePortal={closePortal} />,
                    document.body
                  )}
              </div>
            </FlexContainer>
          )}
        </RelativeDiv>
      </Container>
    </BaseBackground>
  );
}

export default Responses;
