import { Link, useNavigate } from "react-router-dom";
import {
  BlackSection,
  Button,
  InputRes,
  ModalContent,
  SurveyModal,
  Textarea,
} from "../../style";
import { useState } from "react";
import axios from "axios";

function CreateSurveyModal({ closePortal }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const getTitle = (e) => setTitle(e.target.value);
  const getDescription = (e) => setDescription(e.target.value);

  const handleSave = async () => {
    const id = crypto.randomUUID();
    await axios.post("http://localhost:4000/surveys", { id, title: title, description: description});
    navigate((`/survey/` + id), {
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
            <InputRes placeholder="Survey name" value={title} onChange={getTitle}/>
            <Textarea
              placeholder="Survey description"
              value={description}
              onChange={getDescription}
              cols={20}
              rows={5}
            ></Textarea>
            <Button onClick={() => handleSave()}>Create Survey</Button>
            <Link onClick={closePortal}>Back to Surveys</Link>
          </ModalContent>
        </SurveyModal>
    </>
  );
}

export default CreateSurveyModal;
