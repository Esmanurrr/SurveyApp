import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";
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

const initialState = {
  responses: [],
  loading: false,
  error: null,
  initialized: false,
};

const responseSlice = createSlice({
  name: "responses",
  initialState,
  reducers: {},
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
      });
  },
});

export default responseSlice.reducer;
