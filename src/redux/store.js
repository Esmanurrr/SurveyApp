import { configureStore } from "@reduxjs/toolkit";
import surveyReducer from "./suryvey/surveySlice";
import questionReducer from "./question/questionSlice";

export default configureStore({
  reducer: {
    survey: surveyReducer,
    question: questionReducer,
  },
});
