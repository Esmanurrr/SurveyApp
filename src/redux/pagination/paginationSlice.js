import { createSlice } from "@reduxjs/toolkit";

export const ITEMS_PER_PAGE = 5;

const initialState = {
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE,
};

export const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },

    resetPagination: (state) => {
      state.currentPage = 1;
    },
  },
});

export const { setCurrentPage, setItemsPerPage, resetPagination } =
  paginationSlice.actions;

export const selectPaginationState = (state) => state.pagination;
export const selectCurrentPage = (state) => state.pagination.currentPage;
export const selectItemsPerPage = (state) => state.pagination.itemsPerPage;

export const selectPaginatedData = (data, page, itemsPerPage) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
};

export default paginationSlice.reducer;
