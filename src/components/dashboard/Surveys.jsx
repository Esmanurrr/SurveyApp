import { useState, useEffect } from "react";
import {
  BaseBackground,
  Container,
  ContentWrapper,
  EmptyStateWrapper,
  PageHeader,
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
import Pagination from "../common/Pagination";
import {
  selectCurrentPage,
  selectItemsPerPage,
  selectPaginatedData,
  setCurrentPage,
} from "../../redux/pagination/paginationSlice";

function Surveys() {
  const [portal, setPortal] = useState(false);
  const dispatch = useDispatch();
  const { userLoggedIn, loading: authLoading, currentUser } = useAuth();
  const {
    surveys,
    loading: surveysLoading,
    initialized,
  } = useSelector((state) => state.survey);

  // Pagination state
  const currentPage = useSelector(selectCurrentPage);
  const itemsPerPage = useSelector(selectItemsPerPage);

  // Calculate paginated data and total pages
  const paginatedSurveys = selectPaginatedData(
    surveys,
    currentPage,
    itemsPerPage
  );
  const totalPages = Math.ceil(surveys.length / itemsPerPage);

  useEffect(() => {
    if (!userLoggedIn || !currentUser) {
      dispatch(clearSurveys());
      return;
    }

    if (!initialized) {
      dispatch(fetchSurveysAsync(currentUser.uid));
    }
  }, [dispatch, userLoggedIn, currentUser, initialized]);

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

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
            <h1>Recent Surveys</h1>
            {surveys.length > 0 && <CreateSurvey handlePortal={handlePortal} />}
          </PageHeader>

          {!initialized && surveysLoading ? (
            <LoadingPage />
          ) : surveys.length === 0 ? (
            <EmptyStateWrapper>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75M6 16.5a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H6.75z"
                />
              </svg>
              <h2>Create Your First Survey</h2>
              <p>
                Start collecting responses by creating your first survey.
                It&apos;s easy and only takes a few minutes!
              </p>
              <CreateSurvey handlePortal={handlePortal} />
            </EmptyStateWrapper>
          ) : (
            <>
              <SurveyList surveys={paginatedSurveys} />

              {/* Pagination component */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
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

export default Surveys;
