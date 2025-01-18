import { configureStore } from "@reduxjs/toolkit";
import surveyReducer from "./survey/surveySlice";
import questionReducer from "./question/questionSlice";
import responseReducer from "./response/responseSlice";
import authReducer from "./auth/authSlice";

const store = configureStore({
  reducer: {
    survey: surveyReducer,
    question: questionReducer,
    response: responseReducer,
    auth: authReducer,
  },
});

export { store };
