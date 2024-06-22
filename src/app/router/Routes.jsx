import { createBrowserRouter } from "react-router-dom";
import App from '../../App.jsx'
import Surveys from "../../components/dashboard/Surveys";
import Survey from "../../components/survey/Survey.jsx";


export const router = createBrowserRouter(([
    {
        path: '/',
        element: <App/>,
        children: [
            {path: '', element: <Surveys />},
            { path: 'survey/:id', element: <Survey /> },

        ]
    }
]))