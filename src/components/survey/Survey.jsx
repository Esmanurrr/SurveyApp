import { useLocation, useParams } from 'react-router-dom';
import QuestionList from '../question/QuestionList'
import SurveyHeader from './SurveyHeader'
import AddQuestion from '../question/AddQuestion';

const Survey = () => {
  const location = useLocation();
  const { title, description } = location.state || {};
  const { id } = useParams();

  return (
    <div>
        <SurveyHeader title={title} description={description} id={id}/>
        <QuestionList/>
        <AddQuestion/>
    </div>
  )
}

export default Survey