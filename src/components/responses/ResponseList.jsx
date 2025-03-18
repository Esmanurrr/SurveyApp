import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResponsesAsync,
  deleteResponseAsync,
} from "../../redux/response/responseSlice";
import { useAuth } from "../../contexts/authContext";
import {
  HorizontalListContainer,
  EmptyState,
  QuestionListContainer,
} from "../../style";
import ResponseSurveyCard from "./ResponseSurveyCard";
import { toast } from "react-toastify";
import {
  selectCurrentPage,
  selectItemsPerPage,
  selectPaginatedData,
  setCurrentPage,
} from "../../redux/pagination/paginationSlice";
import Pagination from "../common/Pagination";

const ResponseList = () => {
  const dispatch = useDispatch();
  const { responses, error, initialized, loading } = useSelector(
    (state) => state.response
  );
  const { currentUser } = useAuth();

  // Pagination state
  const currentPage = useSelector(selectCurrentPage);
  const itemsPerPage = useSelector(selectItemsPerPage);

  // Calculate paginated data and total pages
  const paginatedResponses = selectPaginatedData(
    responses,
    currentPage,
    itemsPerPage
  );
  const totalPages = Math.ceil(responses.length / itemsPerPage);

  useEffect(() => {
    if (currentUser?.uid && !initialized) {
      dispatch(fetchResponsesAsync(currentUser.uid));
    }
  }, [dispatch, currentUser, initialized]);

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleDelete = async (responseId) => {
    try {
      await dispatch(deleteResponseAsync(responseId)).unwrap();
      toast.success("Response deleted successfully", {
        position: "top-right",
      });
    } catch (error) {
      toast.error(error || "Failed to delete response", {
        position: "top-right",
      });
    }
  };

  if (loading && !initialized) {
    return (
      <QuestionListContainer>
        <EmptyState>
          <h2>Loading responses...</h2>
          <p>Please wait while we fetch your responses.</p>
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
          <p>Share your surveys to start collecting responses!</p>
        </EmptyState>
      </QuestionListContainer>
    );
  }

  return (
    <>
      <HorizontalListContainer>
        {paginatedResponses.map((response) => {
          const { id, title, questions, createdAt, responderId } = response;

          return (
            <ResponseSurveyCard
              key={id}
              id={id}
              title={title}
              questions={questions}
              createdAt={createdAt}
              responderId={responderId}
              onDelete={() => handleDelete(id)}
            />
          );
        })}
      </HorizontalListContainer>

      {/* Pagination component */}
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

export default ResponseList;
