import { configureStore } from "@reduxjs/toolkit";
import surveyReducer from "./suryvey/surveySlice";

export default configureStore({
  reducer: {
    survey: surveyReducer,
  },
});
