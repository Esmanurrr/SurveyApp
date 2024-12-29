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
import { auth, db } from "../../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { surveySchema } from "../../validations/schemas/surveySchema";
import * as yup from "yup"; 
import { toast } from "react-toastify";

function CreateSurveyModal({ closePortal }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getTitle = (e) => setTitle(e.target.value);
  const getDescription = (e) => setDescription(e.target.value);

  const handleSave = async () => {
    
    const newSurvey = {
      title: title,
      description: description,
      questions: [], 
      userId: auth.currentUser?.uid || null,
    };
    
    try {
      await surveySchema.validate({title, description}, {abortEarly: false})
      const userId = auth.currentUser.uid;
      const docRef = await addDoc(collection(db, "surveys"), newSurvey, userId);
      toast.success("Survey added", { position: "top-right"});
      
      navigate(`/survey/${docRef.id}`, {
        state: { title: title, description: description },
      });
      closePortal();
    } catch (validationError) {
      if(validationError instanceof yup.ValidationError){
        setError(validationError.errors[0])
      } else
        toast.error("Survey could not be added.", { position: "top-right"});

    }
  };

  return (
    <>
      <BlackSection/>
        <SurveyModal>
          <h2>Create a new survey</h2>
          <ModalContent>
            {error && <p style={{color: "red"}}>{error}</p>}
            <InputRes placeholder="Survey name" value={title} onChange={getTitle}/>
            <Textarea
              placeholder="Survey description"
              value={description}
              onChange={getDescription}
              cols={20}
              rows={5}
            ></Textarea>
            <Button onClick={() => handleSave()}>Create Survey</Button>
            <Link to='/' onClick={closePortal}>Back to Surveys</Link>
          </ModalContent>
        </SurveyModal>
    </>
  );
}

export default CreateSurveyModal;
