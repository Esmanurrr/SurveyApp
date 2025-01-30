import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  BaseBackground,
  Card,
  CardWrapper,
  Container,
  Header,
  TextCenter,
} from "../../style";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResponseByIdAsync,
  clearCurrentResponse,
} from "../../redux/response/responseSlice";
import LoadingPage from "../infos/LoadingPage";

function ResponseDetail() {
  const dispatch = useDispatch();
  const { responseId } = useParams();
  const { currentResponse, surveyTitle, loading, error } = useSelector(
    (state) => state.response
  );

  useEffect(() => {
    dispatch(fetchResponseByIdAsync(responseId));

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentResponse());
    };
  }, [dispatch, responseId]);

  if (loading) return <LoadingPage />;

  if (error || !currentResponse) {
    return (
      <TextCenter>
        <h3>{error || "Response not found"}</h3>
      </TextCenter>
    );
  }

  return (
    <BaseBackground>
      <Header>
        <Container>
          <h1>{surveyTitle || "Survey Response"}</h1>
        </Container>
      </Header>
      <Container>
        <CardWrapper>
          {currentResponse.questions.map((question, i) => (
            <Card
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "0px",
              }}
              key={question.id}
            >
              <div style={{ padding: "1.5rem" }}>
                <p>
                  <strong>{i + 1}.</strong> {question.name}
                </p>
              </div>
              <hr style={{ border: "1px solid #ddd" }} />
              <div style={{ padding: "1.5rem" }}>
                <p>
                  {Array.isArray(question.answer)
                    ? question.answer.length > 0
                      ? question.answer.join(" , ")
                      : "Unanswered"
                    : question.answer
                    ? question.answer
                    : "Unanswered"}
                </p>
              </div>
            </Card>
          ))}
        </CardWrapper>
      </Container>
    </BaseBackground>
  );
}

export default ResponseDetail;
