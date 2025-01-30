import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteQuestionAsync } from "../../redux/question/questionSlice";
import styled from "styled-components";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: #4a9dec;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const QuestionInfo = styled.div`
  flex: 1;
`;

const QuestionNumber = styled.span`
  color: #4a9dec;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: block;
`;

const QuestionTitle = styled.h3`
  color: #2d3748;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 500;
`;

const QuestionType = styled.div`
  background: #edf2f7;
  color: #4a5568;
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 0.5rem;
  display: inline-block;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: none;
  color: ${(props) => (props.delete ? "#E53E3E" : "#4a9dec")};
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  font-size: 0.9rem;

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const OptionsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const OptionBadge = styled.span`
  background: #f7fafc;
  color: #4a5568;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.85rem;
`;

const QuestionCard = ({ question, index, surveyId }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await dispatch(
        deleteQuestionAsync({ surveyId, questionId: question.id })
      ).unwrap();
      toast.success("Question deleted successfully", {
        position: "top-right",
      });
    } catch (error) {
      toast.error(error || "Failed to delete question", {
        position: "top-right",
      });
    }
  };

  return (
    <Card>
      <CardContent>
        <QuestionHeader>
          <QuestionInfo>
            <QuestionNumber>Question {index + 1}</QuestionNumber>
            <QuestionTitle>{question.name}</QuestionTitle>
            <QuestionType>{question.type}</QuestionType>
          </QuestionInfo>
          <ActionButtons>
            <ActionButton
              as={Link}
              to={`/survey/edit-question/${question.id}`}
              title="Edit Question"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
              </svg>
            </ActionButton>
            <ActionButton onClick={handleDelete} title="Delete Question" delete>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                  clipRule="evenodd"
                />
              </svg>
            </ActionButton>
          </ActionButtons>
        </QuestionHeader>
        {(question.type === "Single Choice" ||
          question.type === "Multiple Choice") && (
          <OptionsContainer>
            {question.options.map((option, i) => (
              <OptionBadge key={i}>{option}</OptionBadge>
            ))}
          </OptionsContainer>
        )}
      </CardContent>
    </Card>
  );
};

QuestionCard.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  index: PropTypes.number.isRequired,
  surveyId: PropTypes.string.isRequired,
};

export default QuestionCard;
