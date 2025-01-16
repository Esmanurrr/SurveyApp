import { useState, useEffect } from "react";
import {
  BaseBackground,
  Container,
  FlexContainer,
  RelativeDiv,
} from "../../style";
import CreateSurveyModal from "./CreateSurveyModal";
import { createPortal } from "react-dom";
import CreateSurvey from "./CreateSurvey";
import SurveyList from "./SurveyList";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSurveysAsync,
  clearSurveys,
} from "../../redux/survey/surveySlice";
import { useAuth } from "../../contexts/authContext";
import LoadingPage from "../infos/LoadingPage";
import { Navigate } from "react-router-dom";

function Surveys() {
  const [portal, setPortal] = useState(false);
  const dispatch = useDispatch();
  const { userLoggedIn, loading: authLoading, currentUser } = useAuth();
  const {
    surveys,
    loading: surveysLoading,
    initialized,
  } = useSelector((state) => state.survey);

  useEffect(() => {
    if (userLoggedIn && currentUser) {
      if (!initialized) {
        dispatch(fetchSurveysAsync());
      }
    } else {
      dispatch(clearSurveys());
    }
  }, [dispatch, userLoggedIn, currentUser, initialized]);

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
        <h1>Recent Surveys</h1>
        <RelativeDiv>
          {surveysLoading ? (
            <LoadingPage />
          ) : (
            <FlexContainer>
              <div style={{ flexGrow: 1 }}>
                <SurveyList surveys={surveys} />
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

export default Surveys;
