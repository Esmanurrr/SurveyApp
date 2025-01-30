import { useParams, Navigate } from "react-router-dom";
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
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #eef2f6;
  background-color: white;
  font-size: 0.9rem;
`;

const NavItem = styled.button`
  padding: 0.5rem;
  border: none;
  background: none;
  color: ${(props) => (props.active ? "#4a9dec" : "#718096")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  &:after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${(props) => (props.active ? "#4a9dec" : "transparent")};
    transition: all 0.2s ease;
  }

  &:hover {
    color: #4a9dec;
  }
`;

const ContentWrapper = styled.div`
  padding: 1rem;
`;

const TabContent = styled.div`
  margin-top: 1rem;
`;

const Survey = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { userLoggedIn, loading: authLoading } = useAuth();
  const {
    currentSurvey,
    loading: surveyLoading,
    error,
  } = useSelector((state) => state.survey);
  const [activeTab, setActiveTab] = useState("questions");

  useEffect(() => {
    const user = auth.currentUser;
    console.log("Current user:", user); // Debug için

    if (userLoggedIn && id && user) {
      // Fetch survey details, questions and responses
      dispatch(fetchSurveyByIdAsync(id));
      dispatch(fetchQuestionsAsync(id));
      dispatch(fetchSurveyResponsesAsync({ surveyId: id, userId: user.uid }));
    }

    // Cleanup function
    return () => {
      dispatch(clearResponses());
    };
  }, [dispatch, id, userLoggedIn]);

  if (authLoading) {
    return <LoadingPage />;
  }

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (surveyLoading) {
    return <LoadingPage />;
  }

  if (error || !currentSurvey) {
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
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </NavItem>
          <NavItem
            active={activeTab === "responses"}
            onClick={() => setActiveTab("responses")}
          >
            Responses ({currentSurvey?.responses?.length || 0})
          </NavItem>
          <NavItem
            active={activeTab === "questions"}
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
