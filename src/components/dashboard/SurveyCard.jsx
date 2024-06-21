import { Card } from "../../style";


function SurveyCard({survey}) {

  return (
    <Card>
        <h2>{survey.title}</h2>
        <span>{survey.description}</span>
        <p>status</p>
    </Card>
  )
}

export default SurveyCard