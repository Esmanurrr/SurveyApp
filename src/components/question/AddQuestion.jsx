import { CardContainer, Container } from "../../style";

function AddQuestion() {
  return (
    <Container>
      <CardContainer>
        <form>
          <div>
            <label>Question</label>
            <input type="text" />
          </div>
          <div>
            <div>
              <label>Question type</label>
              <select>
                <option>Choose a question type</option>
                <option>Single Choice</option>
                <option>Multiple Choice</option>
                <option>Text Response</option>
                <option>Long Text Response</option>
              </select>
            </div>
            <div>
              <label>Can this question be skipped</label>
              <select>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>
        </form>
      </CardContainer>
    </Container>
  );
}

export default AddQuestion;
