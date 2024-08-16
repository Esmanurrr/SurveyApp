import { createBrowserRouter } from "react-router-dom";
import App from '../../App.jsx'
import Surveys from "../../components/dashboard/Surveys";
import Survey from "../../components/survey/Survey.jsx";
import AddQuestion from "../../components/question/AddQuestion.jsx";
import EditQuestion from "../../components/question/EditQuestion.jsx";
import FillSurvey from "../../components/survey/FillSurvey.jsx";


export const router = createBrowserRouter(([
    {
        path: '/',
        element: <App/>,
        children: [
            {path: '', element: <Surveys />},
            { path: 'survey/:id', element: <Survey /> },
            { path: 'survey/new-question/:surveyId', element: <AddQuestion/>},
            { path: 'survey/edit-question/:questionId', element: <EditQuestion/>},
            { path: 'survey/fill-survey/:surveyId', element: <FillSurvey/>},

        ]
    }
]))