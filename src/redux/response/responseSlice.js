import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const fetchResponsesAsync = createAsyncThunk(
  "responses/fetchResponses",
  async (userId) => {
    const q = query(
      collection(db, "responses"),
      where("surveyOwnerId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const responses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return responses;
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

const initialState = {
  responses: [],
  loading: false,
  error: null,
  initialized: false,
};

const responseSlice = createSlice({
  name: "responses",
  initialState,
  reducers: {
    clearResponses: (state) => {
      state.responses = [];
      state.error = null;
      state.initialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponsesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResponsesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.responses = action.payload;
        state.error = null;
        state.initialized = true;
      })
      .addCase(fetchResponsesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createResponseAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResponseAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.responses.push(action.payload);
        state.error = null;
      })
      .addCase(createResponseAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearResponses } = responseSlice.actions;
export default responseSlice.reducer;
