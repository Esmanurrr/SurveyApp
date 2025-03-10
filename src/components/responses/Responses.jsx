import { useState } from "react";
import { useSelector } from "react-redux";
import {
  BaseBackground,
  Container,
  ContentWrapper,
  PageHeader,
} from "../../style";
import CreateSurvey from "../dashboard/CreateSurvey";
import CreateSurveyModal from "../dashboard/CreateSurveyModal";
import { createPortal } from "react-dom";
import ResponseList from "./ResponseList";
import LoadingPage from "../infos/LoadingPage";
import { useAuth } from "../../contexts/authContext";
import { Navigate } from "react-router-dom";
import styled from "styled-components";

function Responses() {
  const [portal, setPortal] = useState(false);
  const { loading: responseLoading, initialized } = useSelector(
    (state) => state.response
  );
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
        <ContentWrapper>
          <PageHeader>
            <h1>Responses</h1>
            <CreateSurvey handlePortal={handlePortal} />
          </PageHeader>

          {responseLoading && !initialized ? <LoadingPage /> : <ResponseList />}
        </ContentWrapper>
      </Container>
      {portal &&
        createPortal(
          <CreateSurveyModal closePortal={closePortal} />,
          document.body
        )}
    </BaseBackground>
  );
}

export default Responses;
