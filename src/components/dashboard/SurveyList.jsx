import SurveyCard from "./SurveyCard";
import { TextCenter } from "../../style";

function SurveyList({ surveys }) {
  if (surveys.length === 0) {
    return <TextCenter>No surveys found. Create your first survey!</TextCenter>;
  }

  return (
    <>
      {surveys.map((survey) => (
        <SurveyCard key={survey.id} survey={survey} />
      ))}
    </>
  );
}

export default SurveyList;
