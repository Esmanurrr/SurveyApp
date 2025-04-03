import { useParams, Navigate, useLocation } from "react-router-dom";
import QuestionList from "../question/QuestionList";
import SurveyHeader from "./SurveyHeader";
import { useEffect, useState } from "react";
import LoadingPage from "../infos/LoadingPage";
import NotFound from "../infos/NotFound";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestionsAsync } from "../../redux/question/questionSlice";
import { fetchSurveyByIdAsync } from "../../redux/survey/surveySlice";
import { fetchSurveyResponsesAsync } from "../../redux/response/responseSlice";
import { useAuth } from "../../contexts/authContext";
import SurveyResponses from "./SurveyResponses";
import styled from "styled-components";
import SurveyOverview from "./SurveyOverview";
import { auth } from "../../firebase/firebase";
import { clearResponses } from "../../redux/response/responseSlice";

const NavMenu = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #eef2f6;
  font-size: 0.9rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative;
  z-index: 1;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 1rem;
  }
`;

const NavItem = styled.button`
  padding: 0.75rem 1.25rem;
  border: none;
  background: ${(props) => (props.$active ? "#4a9dec" : "#ffffff")};
  color: ${(props) => (props.$active ? "#ffffff" : "#64748b")};
  font-weight: ${(props) => (props.$active ? "600" : "500")};
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  border-radius: 8px;
  box-shadow: ${(props) =>
    props.$active
      ? "0 2px 4px rgba(74, 157, 236, 0.1)"
      : "0 1px 2px rgba(0, 0, 0, 0.05)"};
  white-space: nowrap;

  &:hover {
    background: ${(props) => (props.$active ? "#4a9dec" : "#edf2f7")};
    color: ${(props) => (props.$active ? "#ffffff" : "#4a9dec")};
  }

  span {
    margin-left: 0.5rem;
    background: ${(props) => (props.$active ? "#ffffff" : "#edf2f7")};
    color: ${(props) => (props.$active ? "#4a9dec" : "#64748b")};
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
`;

const ContentWrapper = styled.div`
  padding: 1rem;
  background-color: #f8fafc;
  position: relative;
  z-index: 1;
`;

const TabContent = styled.div`
  margin-top: 1rem;
  position: relative;
  z-index: 1;
`;

const Survey = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const { userLoggedIn, loading: authLoading } = useAuth();
  const {
    currentSurvey,
    loading: surveyLoading,
    error,
  } = useSelector((state) => state.survey);
  const { responses } = useSelector((state) => state.response);
  const [activeTab, setActiveTab] = useState("questions");

  useEffect(() => {
    const user = auth.currentUser;

    if (userLoggedIn && id && user) {
      dispatch(fetchSurveyByIdAsync(id));
      dispatch(fetchQuestionsAsync(id));
      dispatch(fetchSurveyResponsesAsync({ surveyId: id, userId: user.uid }));
    }

    return () => {
      dispatch(clearResponses());
    };
  }, [dispatch, id, userLoggedIn]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  if (authLoading) {
    return <LoadingPage />;
  }

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (surveyLoading) {
    return <LoadingPage />;
  }

  if (!surveyLoading && (error || !currentSurvey)) {
    return <NotFound />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <SurveyOverview surveyId={id} />;
      case "responses":
        return <SurveyResponses surveyId={id} />;
      case "questions":
        return <QuestionList surveyId={id} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <SurveyHeader
        title={currentSurvey.title}
        description={currentSurvey.description}
        id={id}
      />
      <ContentWrapper>
        <NavMenu>
          <NavItem
            $active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </NavItem>
          <NavItem
            $active={activeTab === "responses"}
            onClick={() => setActiveTab("responses")}
          >
            Responses ({responses?.length || 0})
          </NavItem>
          <NavItem
            $active={activeTab === "questions"}
            onClick={() => setActiveTab("questions")}
          >
            Questions ({currentSurvey?.questions?.length || 0})
          </NavItem>
        </NavMenu>
        <TabContent>{renderContent()}</TabContent>
      </ContentWrapper>
    </div>
  );
};

export default Survey;
