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
import { auth } from "../../firebase/firebase";

export const fetchResponsesAsync = createAsyncThunk(
  "responses/fetchResponses",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        console.log("fetchResponsesAsync: No userId provided");
        return rejectWithValue("User not authenticated");
      }

      console.log("Fetching responses for user:", userId);

      // orderBy kullanımını kaldırıp sadece filtreleme yapıyoruz
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

      // JavaScript ile sıralama yapıyoruz
      responses.sort((a, b) => {
        // createdAt'e göre azalan sıralama (en yeni en üstte)
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      console.log(`Fetched ${responses.length} responses`);
      return responses;
    } catch (error) {
      console.error("Error fetching responses:", error);
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
      console.log("Delete thunk started with responseId:", responseId);

      if (!auth.currentUser) {
        console.error("No authenticated user found");
        return rejectWithValue("User not authenticated");
      }

      const responseRef = doc(db, "responses", responseId);
      console.log("Fetching response document...");
      const responseDoc = await getDoc(responseRef);

      if (!responseDoc.exists()) {
        console.error("Response document not found");
        return rejectWithValue("Response not found");
      }

      const responseData = responseDoc.data();
      console.log("Response data:", responseData);
      console.log("Current user ID:", auth.currentUser.uid);
      console.log("Response owner ID:", responseData.surveyOwnerId);

      // Kullanıcının kendi yanıtını silmesini kontrol et
      if (responseData.surveyOwnerId !== auth.currentUser.uid) {
        console.error("User not authorized to delete this response");
        return rejectWithValue("Not authorized to delete this response");
      }

      try {
        console.log("Deleting response document...");
        await deleteDoc(responseRef);
        console.log("Response deleted successfully");
        return responseId;
      } catch (deleteError) {
        console.error("Error while deleting:", deleteError);
        if (deleteError.code === "permission-denied") {
          return rejectWithValue(
            "You don't have permission to delete this response. Please check your permissions."
          );
        }
        return rejectWithValue(deleteError.message);
      }
    } catch (error) {
      console.error("Error in deleteResponseAsync:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSurveyResponsesAsync = createAsyncThunk(
  "responses/fetchSurveyResponses",
  async ({ userId, surveyId }, { rejectWithValue }) => {
    try {
      if (!userId || !surveyId) {
        console.log("fetchSurveyResponsesAsync: Missing userId or surveyId");
        return rejectWithValue("Missing required parameters");
      }

      console.log(
        `Fetching responses for survey: ${surveyId}, user: ${userId}`
      );
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

      // JavaScript ile sıralama
      responses.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      console.log(
        `Fetched ${responses.length} responses for survey ${surveyId}`
      );
      return responses;
    } catch (error) {
      console.error("Error fetching survey responses:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch single response
export const fetchResponseByIdAsync = createAsyncThunk(
  "response/fetchResponseByIdAsync",
  async (responseId, { rejectWithValue }) => {
    try {
      const responseRef = doc(db, "responses", responseId);
      const responseSnap = await getDoc(responseRef);

      if (responseSnap.exists()) {
        const responseData = { id: responseSnap.id, ...responseSnap.data() };

        // Fetch survey title
        const surveyRef = doc(db, "surveys", responseData.surveyId);
        const surveySnap = await getDoc(surveyRef);

        if (surveySnap.exists()) {
          return {
            ...responseData,
            surveyTitle: surveySnap.data().title,
          };
        }
        return responseData;
      } else {
        return rejectWithValue("Response not found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Yeni thunk fonksiyonu ekliyoruz
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
            createdAt: responseData.createdAt,
          });
        }
      });

      return responses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Yeni thunk fonksiyonu ekliyoruz
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
      })
      // Fetch single response
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
      // Yeni case'leri ekliyoruz
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
