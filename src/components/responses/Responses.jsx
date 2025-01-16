import { useState } from "react";
import { useSelector } from "react-redux";
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
import LoadingPage from "../infos/LoadingPage";
import { useAuth } from "../../contexts/authContext";
import { Navigate } from "react-router-dom";

function Responses() {
  const [portal, setPortal] = useState(false);
  const { loading: responseLoading } = useSelector((state) => state.response);
  const { userLoggedIn, loading: authLoading } = useAuth();

  const handlePortal = () => {
    setPortal(true);
  };

  const closePortal = () => {
    setPortal(false);
  };

  if (authLoading) {
    return <LoadingPage />;
  }

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <BaseBackground>
      <Container>
        <h1>Responses</h1>
        <RelativeDiv>
          {responseLoading ? (
            <LoadingPage />
          ) : (
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
