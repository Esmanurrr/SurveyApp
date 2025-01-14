import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

// Anket ekleme
export const addSurveyAsync = createAsyncThunk(
  "survey/addSurveyAsync",
  async (newSurvey, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "surveys"), newSurvey);
      return { id: docRef.id, ...newSurvey };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Anket güncelleme
export const updateSurveyAsync = createAsyncThunk(
  "survey/updateSurveyAsync",
  async ({ id, updatedSurvey }, { rejectWithValue }) => {
    try {
      const surveyRef = doc(db, "surveys", id);
      await updateDoc(surveyRef, updatedSurvey);
      return { id, ...updatedSurvey };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Anket silme
export const deleteSurveyAsync = createAsyncThunk(
  "survey/deleteSurveyAsync",
  async (id, { rejectWithValue }) => {
    try {
      const surveyRef = doc(db, "surveys", id);
      await deleteDoc(surveyRef);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const surveySlice = createSlice({
  name: "survey",
  initialState: {
    surveys: [],
    currentSurvey: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentSurvey: (state, action) => {
      state.currentSurvey = action.payload;
      state.loading = false;
      state.error = null;
    },
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
      .addCase(addSurveyAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSurveyAsync.fulfilled, (state, action) => {
        state.surveys.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addSurveyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSurveyAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSurveyAsync.fulfilled, (state, action) => {
        const index = state.surveys.findIndex(
          (survey) => survey.id === action.payload.id
        );
        if (index !== -1) {
          state.surveys[index] = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateSurveyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSurveyAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSurveyAsync.fulfilled, (state, action) => {
        state.surveys = state.surveys.filter(
          (survey) => survey.id !== action.payload
        );
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteSurveyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentSurvey, setLoading, setError } = surveySlice.actions;
export default surveySlice.reducer;
