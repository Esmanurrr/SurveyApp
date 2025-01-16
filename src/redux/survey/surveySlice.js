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
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { auth } from "../../firebase/firebase";

// Tüm anketleri getirme
export const fetchSurveysAsync = createAsyncThunk(
  "survey/fetchSurveysAsync",
  async (_, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        return rejectWithValue("User not authenticated");
      }

      const surveysRef = collection(db, "surveys");
      const q = query(surveysRef, where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      const surveys = [];
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          surveys.push({ id: doc.id, ...doc.data() });
        }
      });
      return surveys;
    } catch (error) {
      console.error("Error fetching surveys:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Anket ekleme
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
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "surveys"), surveyWithUser);
      return { id: docRef.id, ...surveyWithUser };
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

// Tekil anket getirme
export const fetchSurveyByIdAsync = createAsyncThunk(
  "survey/fetchSurveyByIdAsync",
  async (id, { rejectWithValue }) => {
    try {
      const surveyRef = doc(db, "surveys", id);
      const surveyDoc = await getDoc(surveyRef);

      if (surveyDoc.exists()) {
        return { id: surveyDoc.id, ...surveyDoc.data() };
      } else {
        return rejectWithValue("Survey not found");
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
      })
      .addCase(fetchSurveyByIdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSurveyByIdAsync.fulfilled, (state, action) => {
        state.currentSurvey = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchSurveyByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentSurvey = null;
      });
  },
});

export const { setCurrentSurvey, setLoading, setError, clearSurveys } =
  surveySlice.actions;
export default surveySlice.reducer;
