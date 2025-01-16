import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ResponseSurveyCard from "./ResponseSurveyCard";
import { TextCenter } from "../../style";
import { fetchResponsesAsync } from "../../redux/response/responseSlice";
import { useAuth } from "../../contexts/authContext";

function ResponseList() {
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

  if (error) {
    return <TextCenter>Error loading responses: {error}</TextCenter>;
  }

  if (!responses || responses.length === 0) {
    return (
      <TextCenter>
        No response found. Create your first survey and share to get response!
      </TextCenter>
    );
  }

  return (
    <>
      {responses.map((response) => (
        <ResponseSurveyCard
          key={response.id}
          id={response.id}
          title={response.title}
        />
      ))}
    </>
  );
}

export default ResponseList;
