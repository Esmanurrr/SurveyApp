import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const fetchResponsesAsync = createAsyncThunk(
  "responses/fetchResponses",
  async (userId, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "responses"),
        where("surveyOwnerId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const responses = [];
      querySnapshot.forEach((doc) => {
        responses.push({ id: doc.id, ...doc.data() });
      });
      return responses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createResponseAsync = createAsyncThunk(
  "responses/createResponse",
  async (responseData) => {
    const responsesRef = collection(db, "responses");
    const docRef = await addDoc(responsesRef, responseData);
    return { id: docRef.id, ...responseData };
  }
);

export const deleteResponseAsync = createAsyncThunk(
  "responses/deleteResponse",
  async (responseId, { rejectWithValue }) => {
    try {
      const responseRef = doc(db, "responses", responseId);
      await deleteDoc(responseRef);
      return responseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSurveyResponsesAsync = createAsyncThunk(
  "responses/fetchSurveyResponses",
  async ({ userId, surveyId }, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "responses"),
        where("surveyOwnerId", "==", userId),
        where("surveyId", "==", surveyId)
      );

      const querySnapshot = await getDocs(q);
      const responses = [];
      querySnapshot.forEach((doc) => {
        responses.push({ id: doc.id, ...doc.data() });
      });
      return responses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const responseSlice = createSlice({
  name: "response",
  initialState: {
    responses: [],
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    clearResponses: (state) => {
      state.responses = [];
      state.initialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all responses
      .addCase(fetchResponsesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResponsesAsync.fulfilled, (state, action) => {
        state.responses = action.payload;
        state.loading = false;
        state.error = null;
        state.initialized = true;
      })
      .addCase(fetchResponsesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch survey responses
      .addCase(fetchSurveyResponsesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSurveyResponsesAsync.fulfilled, (state, action) => {
        state.responses = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchSurveyResponsesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete response
      .addCase(deleteResponseAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResponseAsync.fulfilled, (state, action) => {
        state.responses = state.responses.filter(
          (response) => response.id !== action.payload
        );
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteResponseAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearResponses } = responseSlice.actions;
export default responseSlice.reducer;
