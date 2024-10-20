import { Link } from "react-router-dom";
import { Card } from "../../style";


function SurveyCard({survey}) {

  return (
    <Card>
        <Link 
        to={`survey/${survey.id}`}
        state={{ title: survey.title, description: survey.description }}
          >
          <h2>{survey.title}</h2>
          <span>{survey.description}</span>
        </Link>
    </Card>
  )
}

export default SurveyCard