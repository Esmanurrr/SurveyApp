import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { auth } from "../../firebase/firebase";

export const fetchSurveysAsync = createAsyncThunk(
  "surveys/fetchSurveys",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue("User not authenticated");
      }

      const q = query(collection(db, "surveys"), where("userId", "==", userId));

      const querySnapshot = await getDocs(q);
      const surveys = [];

      querySnapshot.forEach((doc) => {
        surveys.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        });
      });

      surveys.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      return surveys;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addSurveyAsync = createAsyncThunk(
  "survey/addSurveyAsync",
  async (newSurvey, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        return rejectWithValue("User not authenticated");
      }

      const surveyWithUser = {
        ...newSurvey,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "surveys"), surveyWithUser);

      return {
        id: docRef.id,
        ...surveyWithUser,
        createdAt: new Date(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSurveyAsync = createAsyncThunk(
  "survey/updateSurveyAsync",
  async ({ id, updatedSurvey }, { rejectWithValue }) => {
    try {
      const surveyRef = doc(db, "surveys", id);
      const surveyDoc = await getDoc(surveyRef);

      if (!surveyDoc.exists()) {
        return rejectWithValue("Survey not found");
      }

      if (surveyDoc.data().userId !== auth.currentUser?.uid) {
        return rejectWithValue("Not authorized to update this survey");
      }

      await updateDoc(surveyRef, updatedSurvey);
      return { id, ...updatedSurvey };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSurveyByIdAsync = createAsyncThunk(
  "survey/fetchSurveyByIdAsync",
  async (id, { rejectWithValue }) => {
    try {
      const surveyRef = doc(db, "surveys", id);
      const surveyDoc = await getDoc(surveyRef);

      if (surveyDoc.exists()) {
        const surveyData = surveyDoc.data();
        return {
          id: surveyDoc.id,
          ...surveyData,
          createdAt: surveyData.createdAt?.toDate?.() || new Date(),
        };
      } else {
        return rejectWithValue("Survey not found");
      }
    } catch (error) {
      return rejectWithValue("Failed to fetch survey. Please try again later.");
    }
  }
);

export const deleteSurveyAsync = createAsyncThunk(
  "survey/deleteSurveyAsync",
  async (surveyId, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        return rejectWithValue("User not authenticated");
      }

      const surveyRef = doc(db, "surveys", surveyId);
      const surveyDoc = await getDoc(surveyRef);

      if (!surveyDoc.exists()) {
        return rejectWithValue("Survey not found");
      }

      if (surveyDoc.data().userId !== auth.currentUser.uid) {
        return rejectWithValue("Not authorized to delete this survey");
      }

      await deleteDoc(surveyRef);
      return surveyId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSurveyByQuestionIdAsync = createAsyncThunk(
  "survey/fetchSurveyByQuestionIdAsync",
  async (questionId, { rejectWithValue }) => {
    try {
      const surveysRef = collection(db, "surveys");
      const querySnapshot = await getDocs(surveysRef);
      let targetSurvey = null;

      querySnapshot.forEach((doc) => {
        const surveyData = doc.data();
        const hasQuestion = surveyData.questions?.some(
          (q) => q.id === questionId
        );
        if (hasQuestion) {
          targetSurvey = {
            id: doc.id,
            ...surveyData,
            createdAt: surveyData.createdAt?.toDate?.() || new Date(),
          };
        }
      });

      if (targetSurvey) {
        return targetSurvey;
      } else {
        return rejectWithValue("Survey not found for this question");
      }
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
    initialized: false,
  },
  reducers: {
    clearSurveys: (state) => {
      state.surveys = [];
      state.currentSurvey = null;
      state.error = null;
      state.initialized = false;
    },
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
      .addCase(fetchSurveysAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSurveysAsync.fulfilled, (state, action) => {
        state.surveys = action.payload;
        state.loading = false;
        state.error = null;
        state.initialized = true;
      })
      .addCase(fetchSurveysAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (action.payload === "User not authenticated") {
          state.surveys = [];
          state.currentSurvey = null;
          state.initialized = false;
        }
      })
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
      .addCase(fetchSurveyByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSurveyByIdAsync.fulfilled, (state, action) => {
        state.currentSurvey = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchSurveyByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSurveyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSurveyAsync.fulfilled, (state, action) => {
        state.surveys = state.surveys.filter(
          (survey) => survey.id !== action.payload
        );
        if (state.currentSurvey?.id === action.payload) {
          state.currentSurvey = null;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteSurveyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSurveyByQuestionIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSurveyByQuestionIdAsync.fulfilled, (state, action) => {
        state.currentSurvey = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchSurveyByQuestionIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSurveys, setCurrentSurvey, setLoading, setError } =
  surveySlice.actions;
export default surveySlice.reducer;
