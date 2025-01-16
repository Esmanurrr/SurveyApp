import { configureStore } from "@reduxjs/toolkit";
import surveyReducer from "./survey/surveySlice";
import questionReducer from "./question/questionSlice";
import responseReducer from "./response/responseSlice";

export default configureStore({
  reducer: {
    survey: surveyReducer,
    question: questionReducer,
    response: responseReducer,
  },
});
