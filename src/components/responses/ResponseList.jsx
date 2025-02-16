import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResponsesAsync,
  deleteResponseAsync,
} from "../../redux/response/responseSlice";
import { useAuth } from "../../contexts/authContext";
import { HorizontalListContainer, EmptyState } from "../../style";
import ResponseSurveyCard from "./ResponseSurveyCard";
import { toast } from "react-toastify";

const ResponseList = () => {
  const dispatch = useDispatch();
  const { responses, error, initialized } = useSelector(
    (state) => state.response
  );
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.uid && !initialized) {
      dispatch(fetchResponsesAsync(currentUser.uid));
    }
  }, [dispatch, currentUser, initialized]);

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

  if (error) {
    return (
      <EmptyState>
        <h3>Error</h3>
        <p>Error loading responses: {error}</p>
      </EmptyState>
    );
  }

  if (!responses || responses.length === 0) {
    return (
      <EmptyState>
        <h3>No Responses Yet</h3>
        <p>Share your surveys to start collecting responses!</p>
      </EmptyState>
    );
  }

  return (
    <HorizontalListContainer>
      {responses.map((response) => {
        return (
          <ResponseSurveyCard
            key={response.id}
            id={response.id}
            title={response.title}
            questions={response.questions}
            createdAt={response.createdAt}
            onDelete={() => handleDelete(response.id)}
          />
        );
      })}
    </HorizontalListContainer>
  );
};

export default ResponseList;
