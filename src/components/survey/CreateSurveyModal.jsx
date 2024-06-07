import { Link } from "react-router-dom";
import {
  BlackSection,
  Button,
  Input,
  ModalContent,
  SurveyModal,
  Textarea,
} from "../../style";

function CreateSurveyModal({ closePortal }) {
  return (
    <>
      <BlackSection></BlackSection>
        <SurveyModal>
          <h2>Create a new survey</h2>
          <ModalContent>
            <Input placeholder="Survey name" />
            <Textarea
              placeholder="Survey description"
              cols={20}
              rows={5}
            ></Textarea>
            <Button>Create Survey</Button>
            <Link onClick={closePortal}>Back to Surveys</Link>
          </ModalContent>
        </SurveyModal>
    </>
  );
}

export default CreateSurveyModal;
