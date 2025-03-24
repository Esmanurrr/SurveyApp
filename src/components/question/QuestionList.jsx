import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestionsAsync } from "../../redux/question/questionSlice";
import LoadingPage from "../infos/LoadingPage";
import QuestionCard from "./QuestionCard";
import AddQuestionButton from "./AddQuestionButton";
import { EmptyState, QuestionGrid, QuestionListContainer } from "../../style";
import Pagination from "../common/Pagination";
import {
  selectCurrentPage,
  selectItemsPerPage,
  selectPaginatedData,
  setCurrentPage,
} from "../../redux/pagination/paginationSlice";

function QuestionList({ surveyId }) {
  const dispatch = useDispatch();
  const { questions, loading } = useSelector((state) => state.question);

  const currentPage = useSelector(selectCurrentPage);
  const itemsPerPage = useSelector(selectItemsPerPage);

  const paginatedQuestions = selectPaginatedData(
    questions,
    currentPage,
    itemsPerPage
  );
  const totalPages = Math.ceil(questions.length / itemsPerPage);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  useEffect(() => {
    dispatch(fetchQuestionsAsync(surveyId));
  }, [dispatch, surveyId]);

  if (loading) return <LoadingPage />;

  return (
    <QuestionListContainer>
      {!questions.length ? (
        <EmptyState>
          <h2>Let&apos;s add some questions to your survey</h2>
          <p>Click the button below to get your survey up and running</p>
          <AddQuestionButton />
        </EmptyState>
      ) : (
        <>
          <QuestionGrid>
            {paginatedQuestions.map((question, index) => (
              <QuestionCard
                surveyId={surveyId}
                key={question.id || index}
                index={index + (currentPage - 1) * itemsPerPage}
                question={question}
              />
            ))}
          </QuestionGrid>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

          <AddQuestionButton />
        </>
      )}
    </QuestionListContainer>
  );
}

export default QuestionList;
