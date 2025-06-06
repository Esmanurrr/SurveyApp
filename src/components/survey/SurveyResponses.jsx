import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSurveyResponsesAsync,
  deleteResponseAsync,
} from "../../redux/response/responseSlice";
import { useAuth } from "../../contexts/authContext";
import {
  HorizontalListContainer,
  HorizontalCard,
  CardContent,
  CardTitle,
  CardDescription,
  CardMeta,
  CardMetaItem,
  CardActions,
  ActionButton,
  EmptyState,
  QuestionListContainer,
} from "../../style";
import { toast } from "react-toastify";
import Pagination from "../common/Pagination";
import {
  selectCurrentPage,
  selectItemsPerPage,
  selectPaginatedData,
  setCurrentPage,
} from "../../redux/pagination/paginationSlice";

const formatTimeAgo = (date) => {
  const now = new Date();
  const responseDate = new Date(date);
  const diffInSeconds = Math.floor((now - responseDate) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return responseDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const SurveyResponses = ({ surveyId }) => {
  const dispatch = useDispatch();
  const { responses, error, loading } = useSelector((state) => state.response);
  const { currentUser } = useAuth();

  const currentPage = useSelector(selectCurrentPage);
  const itemsPerPage = useSelector(selectItemsPerPage);

  const paginatedResponses = selectPaginatedData(
    responses,
    currentPage,
    itemsPerPage
  );
  const totalPages = Math.ceil(responses.length / itemsPerPage);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  useEffect(() => {
    if (currentUser?.uid && surveyId) {
      dispatch(
        fetchSurveyResponsesAsync({ userId: currentUser.uid, surveyId })
      );
    }
  }, [dispatch, currentUser, surveyId]);

  const handleDelete = async (responseId) => {
    try {
      await dispatch(deleteResponseAsync(responseId)).unwrap();
      dispatch(
        fetchSurveyResponsesAsync({ userId: currentUser.uid, surveyId })
      );
      toast.success("Response deleted successfully", {
        position: "top-right",
      });
    } catch (error) {
      toast.error(error || "Failed to delete response", {
        position: "top-right",
      });
    }
  };

  if (loading) {
    return (
      <QuestionListContainer>
        <EmptyState>
          <h2>Loading...</h2>
          <p>Please wait while we fetch the responses.</p>
        </EmptyState>
      </QuestionListContainer>
    );
  }

  if (error) {
    return (
      <QuestionListContainer>
        <EmptyState>
          <h2>Error</h2>
          <p>Error loading responses: {error}</p>
        </EmptyState>
      </QuestionListContainer>
    );
  }

  if (!responses || responses.length === 0) {
    return (
      <QuestionListContainer>
        <EmptyState>
          <h2>No Responses Yet</h2>
          <p>Share your survey to start collecting responses!</p>
          <ActionButton
            as={Link}
            to={`/survey/fill-survey/${surveyId}`}
            target="_blank"
            rel="noopener noreferrer"
            $primary
          >
            Share Survey
          </ActionButton>
        </EmptyState>
      </QuestionListContainer>
    );
  }

  return (
    <>
      <HorizontalListContainer>
        {paginatedResponses.map((response) => (
          <HorizontalCard key={response.id}>
            <CardContent>
              <CardTitle>{response.title}</CardTitle>
              <CardDescription>
                {response.questions?.length || 0} Questions Answered
              </CardDescription>
              <CardMeta>
                <CardMetaItem>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                  {formatTimeAgo(response.createdAt)}
                </CardMetaItem>
                <CardMetaItem>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  Anonymous #{response.responderId}
                </CardMetaItem>
              </CardMeta>
            </CardContent>

            <CardActions>
              <ActionButton as={Link} to={`/response/${response.id}`} $primary>
                View Details
              </ActionButton>
              <ActionButton $danger onClick={() => handleDelete(response.id)}>
                Delete
              </ActionButton>
            </CardActions>
          </HorizontalCard>
        ))}
      </HorizontalListContainer>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default SurveyResponses;
