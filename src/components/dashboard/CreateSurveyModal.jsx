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
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";

function CreateSurveyModal({ closePortal }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const getTitle = (e) => setTitle(e.target.value);
  const getDescription = (e) => setDescription(e.target.value);

  const handleSave = async () => {
    const newSurvey = {
      title: title,
      description: description,
      questions: [], 
    };
  
    try {
      // Firestore'a yeni anket ekle
      const docRef = await addDoc(collection(db, "surveys"), newSurvey);
      console.log("Anket başarıyla eklendi, ID: ", docRef.id);
  
      navigate(`/survey/${docRef.id}`, {
        state: { title: title, description: description },
      });
      closePortal();
    } catch (err) {
      console.error("Anket eklenirken hata oluştu: ", err);
    }
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
