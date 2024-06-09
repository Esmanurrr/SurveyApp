import { Link, useNavigate } from "react-router-dom";
import {
  BlackSection,
  Button,
  Input,
  ModalContent,
  SurveyModal,
  Textarea,
} from "../../style";
import { useState } from "react";

function CreateSurveyModal({ closePortal }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const getTitle = (e) => setTitle(e.target.value);
  const getDescription = (e) => setDescription(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/survey`, {
      state: { title: title, description: description },
    });
    closePortal();
  };

  return (
    <>
      <BlackSection></BlackSection>
        <SurveyModal>
          <h2>Create a new survey</h2>
          <ModalContent>
            <Input placeholder="Survey name" value={title} onChange={getTitle}/>
            <Textarea
              placeholder="Survey description"
              value={description}
              onChange={getDescription}
              cols={20}
              rows={5}
            ></Textarea>
            <Button onClick={(e) => handleSubmit(e)}>Create Survey</Button>
            <Link onClick={closePortal}>Back to Surveys</Link>
          </ModalContent>
        </SurveyModal>
    </>
  );
}

export default CreateSurveyModal;
