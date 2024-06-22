import { useLocation, useParams } from 'react-router-dom';
import QuestionList from '../question/QuestionList'
import SurveyHeader from './SurveyHeader'

const Survey = () => {
  const location = useLocation();
  const { title, description } = location.state || {};
  const { id } = useParams();

  return (
    <div>
        <SurveyHeader title={title} description={description} id={id}/>
        <QuestionList/>
    </div>
  )
}

export default Survey