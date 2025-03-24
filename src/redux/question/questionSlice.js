import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const fetchQuestionsAsync = createAsyncThunk(
  "question/fetchQuestionsAsync",
  async (surveyId, { rejectWithValue }) => {
    try {
      const surveyRef = doc(db, "surveys", surveyId);
      const surveyDoc = await getDoc(surveyRef);
      if (surveyDoc.exists()) {
        return surveyDoc.data().questions || [];
      } else {
        return rejectWithValue("Survey not found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const addQuestionAsync = createAsyncThunk(
  "question/addQuestionAsync",
  async ({ surveyId, newQuestion }, { rejectWithValue }) => {
    try {
      const surveyRef = doc(db, "surveys", surveyId);
      const surveyDoc = await getDoc(surveyRef);

      if (surveyDoc.exists()) {
        const surveyData = surveyDoc.data();

        const questionWithId = {
          ...newQuestion,
          id: crypto.randomUUID(),
        };

        const updatedQuestions = [
          ...(surveyData.questions || []),
          questionWithId,
        ];

        await updateDoc(surveyRef, { questions: updatedQuestions });
        return questionWithId;
      } else {
        return rejectWithValue("Survey not found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuestionAsync = createAsyncThunk(
  "question/updateQuestionAsync",
  async ({ surveyId, updatedQuestion }, { rejectWithValue }) => {
    try {
      const surveyRef = doc(db, "surveys", surveyId);
      const surveyDoc = await getDoc(surveyRef);

      if (surveyDoc.exists()) {
        const surveyData = surveyDoc.data();
        const currentQuestions = surveyData.questions || [];

        const questionIndex = currentQuestions.findIndex(
          (q) => q.id === updatedQuestion.id
        );
        if (questionIndex === -1) {
          return rejectWithValue("Question not found");
        }

        const updatedQuestions = [...currentQuestions];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          ...updatedQuestion,
          id: updatedQuestion.id, 
        };

        await updateDoc(surveyRef, { questions: updatedQuestions });
        return updatedQuestions[questionIndex];
      } else {
        return rejectWithValue("Survey not found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuestionAsync = createAsyncThunk(
  "question/deleteQuestionAsync",
  async ({ surveyId, questionId }, { rejectWithValue }) => {
    try {
      const surveyRef = doc(db, "surveys", surveyId);
      const surveyDoc = await getDoc(surveyRef);
      if (surveyDoc.exists()) {
        const surveyData = surveyDoc.data();
        const updatedQuestions = surveyData.questions.filter(
          (question) => question.id !== questionId
        );
        await updateDoc(surveyRef, { questions: updatedQuestions });
        return questionId;
      } else {
        return rejectWithValue("Survey not found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  questions: [],
  currentQuestion: null,
  loading: false,
  error: null,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    updateCurrentQuestion: (state, action) => {
      state.currentQuestion = { ...state.currentQuestion, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionsAsync.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchQuestionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addQuestionAsync.fulfilled, (state, action) => {
        state.questions.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(updateQuestionAsync.fulfilled, (state, action) => {
        const index = state.questions.findIndex(
          (question) => question.id === action.payload.id
        );
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteQuestionAsync.fulfilled, (state, action) => {
        state.questions = state.questions.filter(
          (question) => question.id !== action.payload
        );
        state.loading = false;
        state.error = null;
      });
  },
});

export const {
  setLoading,
  setError,
  setCurrentQuestion,
  updateCurrentQuestion,
} = questionSlice.actions;
export default questionSlice.reducer;
