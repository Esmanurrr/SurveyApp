import { useState } from "react";
import { useSelector } from "react-redux";
import { BaseBackground, Container } from "../../style";
import CreateSurvey from "../dashboard/CreateSurvey";
import CreateSurveyModal from "../dashboard/CreateSurveyModal";
import { createPortal } from "react-dom";
import ResponseList from "./ResponseList";
import LoadingPage from "../infos/LoadingPage";
import { useAuth } from "../../contexts/authContext";
import { Navigate } from "react-router-dom";
import styled from "styled-components";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eef2f6;

  h1 {
    margin: 0;
    color: #2d3748;
    font-size: 1.8rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  text-align: center;
  margin-top: 2rem;

  svg {
    width: 120px;
    height: 120px;
    color: #4a9dec;
    margin-bottom: 2rem;
  }

  h2 {
    color: #2d3748;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: #718096;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    max-width: 500px;
  }
`;

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
