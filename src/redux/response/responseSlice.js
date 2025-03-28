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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { auth } from "../../firebase/firebase";

export const fetchResponsesAsync = createAsyncThunk(
  "responses/fetchResponses",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue("User not authenticated");
      }

      const q = query(
        collection(db, "responses"),
        where("surveyOwnerId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const responses = [];

      querySnapshot.forEach((doc) => {
        responses.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        });
      });

      responses.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
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
    const dataWithTimestamp = {
      ...responseData,
      createdAt: serverTimestamp(),
    };

    const responsesRef = collection(db, "responses");
    const docRef = await addDoc(responsesRef, dataWithTimestamp);

    return {
      id: docRef.id,
      ...responseData,
      createdAt: new Date(),
    };
  }
);

export const deleteResponseAsync = createAsyncThunk(
  "responses/deleteResponse",
  async (responseId, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        return rejectWithValue("User not authenticated");
      }

      const responseRef = doc(db, "responses", responseId);
      const responseDoc = await getDoc(responseRef);

      if (!responseDoc.exists()) {
        return rejectWithValue("Response not found");
      }

      const responseData = responseDoc.data();

      if (responseData.surveyOwnerId !== auth.currentUser.uid) {
        return rejectWithValue("Not authorized to delete this response");
      }

      try {
        await deleteDoc(responseRef);
        return responseId;
      } catch (deleteError) {
        if (deleteError.code === "permission-denied") {
          return rejectWithValue(
            "You don't have permission to delete this response. Please check your permissions."
          );
        }
        return rejectWithValue(deleteError.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSurveyResponsesAsync = createAsyncThunk(
  "responses/fetchSurveyResponses",
  async ({ userId, surveyId }, { rejectWithValue }) => {
    try {
      if (!userId || !surveyId) {
        return rejectWithValue("Missing required parameters");
      }

      const q = query(
        collection(db, "responses"),
        where("surveyOwnerId", "==", userId),
        where("surveyId", "==", surveyId)
      );

      const querySnapshot = await getDocs(q);
      const responses = [];

      querySnapshot.forEach((doc) => {
        responses.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        });
      });

      responses.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      return responses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchResponseByIdAsync = createAsyncThunk(
  "response/fetchResponseByIdAsync",
  async (responseId, { rejectWithValue }) => {
    try {
      const responseRef = doc(db, "responses", responseId);
      const responseSnap = await getDoc(responseRef);

      if (responseSnap.exists()) {
        const responseData = responseSnap.data();
        const formattedResponse = {
          id: responseSnap.id,
          ...responseData,
          createdAt: responseData.createdAt?.toDate?.() || new Date(),
        };

        const surveyRef = doc(db, "surveys", formattedResponse.surveyId);
        const surveySnap = await getDoc(surveyRef);

        if (surveySnap.exists()) {
          return {
            ...formattedResponse,
            surveyTitle: surveySnap.data().title,
          };
        }
        return formattedResponse;
      } else {
        return rejectWithValue("Response not found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuestionResponsesAsync = createAsyncThunk(
  "responses/fetchQuestionResponses",
  async ({ questionId, surveyId }, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "responses"),
        where("surveyId", "==", surveyId)
      );

      const querySnapshot = await getDocs(q);
      const responses = [];

      querySnapshot.forEach((doc) => {
        const responseData = doc.data();
        const questionResponse = responseData.questions.find(
          (q) => q.id === questionId
        );

        if (questionResponse?.answer) {
          responses.push({
            id: doc.id,
            answer: questionResponse.answer,
            createdAt: responseData.createdAt?.toDate?.() || new Date(),
          });
        }
      });

      return responses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchResponsesByQuestionIdAsync = createAsyncThunk(
  "responses/fetchResponsesByQuestionId",
  async ({ questionId, surveyId }, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "responses"),
        where("surveyId", "==", surveyId)
      );

      const querySnapshot = await getDocs(q);
      const responses = [];

      querySnapshot.forEach((doc) => {
        const responseData = doc.data();
        const questionResponse = responseData.questions.find(
          (q) => q.id === questionId
        );

        if (questionResponse?.answer) {
          responses.push({
            id: doc.id,
            ...responseData,
            createdAt: responseData.createdAt?.toDate?.() || new Date(),
          });
        }
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
    currentResponse: null,
    surveyTitle: "",
    loading: false,
    error: null,
    initialized: false,
    questionResponses: [],
  },
  reducers: {
    clearResponses: (state) => {
      state.responses = [];
      state.initialized = false;
    },
    clearCurrentResponse: (state) => {
      state.currentResponse = null;
      state.surveyTitle = "";
    },
  },
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(fetchResponseByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResponseByIdAsync.fulfilled, (state, action) => {
        state.currentResponse = action.payload;
        state.surveyTitle = action.payload.surveyTitle || "";
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchResponseByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchQuestionResponsesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionResponsesAsync.fulfilled, (state, action) => {
        state.questionResponses = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchQuestionResponsesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchResponsesByQuestionIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResponsesByQuestionIdAsync.fulfilled, (state, action) => {
        state.responses = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchResponsesByQuestionIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearResponses, clearCurrentResponse } = responseSlice.actions;
export default responseSlice.reducer;
