import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import surveyReducer from "./survey/surveySlice";
import questionReducer from "./question/questionSlice";
import responseReducer from "./response/responseSlice";
import paginationReducer from "./pagination/paginationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    survey: surveyReducer,
    question: questionReducer,
    response: responseReducer,
    pagination: paginationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { store };
