import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { resetPagination } from "../../redux/pagination/paginationSlice";
import { fetchResponsesAsync } from "../../redux/response/responseSlice";

function Responses() {
  const [portal, setPortal] = useState(false);
  const dispatch = useDispatch();
  const { loading: responseLoading, initialized } = useSelector(
    (state) => state.response
  );
  const { userLoggedIn, loading: authLoading, currentUser } = useAuth();

  // Reset pagination when component mounts
  useEffect(() => {
    dispatch(resetPagination());
  }, [dispatch]);

  // Fetch responses when authenticated user is available
  useEffect(() => {
    if (userLoggedIn && currentUser?.uid && !initialized) {
      dispatch(fetchResponsesAsync(currentUser.uid));
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
