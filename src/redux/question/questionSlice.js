import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

// Soruları getirme
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

// Soru ekleme

export const addQuestionAsync = createAsyncThunk(
  "question/addQuestionAsync",
  async ({ surveyId, newQuestion }, { rejectWithValue }) => {
    try {
      const surveyRef = doc(db, "surveys", surveyId);
      const surveyDoc = await getDoc(surveyRef);

      if (surveyDoc.exists()) {
        const surveyData = surveyDoc.data();

        // Burada benzersiz bir id ekleniyor
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

// Soru güncelleme
export const updateQuestionAsync = createAsyncThunk(
  "question/updateQuestionAsync",
  async ({ surveyId, updatedQuestion }, { rejectWithValue }) => {
    try {
      const surveyRef = doc(db, "surveys", surveyId);
      const surveyDoc = await getDoc(surveyRef);
      if (surveyDoc.exists()) {
        const surveyData = surveyDoc.data();
        const updatedQuestions = surveyData.questions.map((question) =>
          question.id === updatedQuestion.id ? updatedQuestion : question
        );
        await updateDoc(surveyRef, { questions: updatedQuestions });
        return updatedQuestion;
      } else {
        return rejectWithValue("Survey not found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Soru silme
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

const questionSlice = createSlice({
  name: "question",
  initialState: {
    questions: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
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

export const { setLoading, setError } = questionSlice.actions;
export default questionSlice.reducer;
