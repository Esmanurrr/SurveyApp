import { createBrowserRouter } from "react-router-dom";
import App from '../../App.jsx'
import Surveys from "../../components/survey/Surveys";
import CreateSurveyModal from "../../components/survey/CreateSurveyModal.jsx";


export const router = createBrowserRouter(([
    {
        path: '/',
        element: <App/>,
        children: [
            {path: '', element: <Surveys />},
            {path: 'createsurveymodal', element: <CreateSurveyModal />}
        ]
    }
]))