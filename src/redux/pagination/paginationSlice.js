import { createSlice } from "@reduxjs/toolkit";

// Sayfa başına gösterilecek öğe sayısı
export const ITEMS_PER_PAGE = 5;

// Başlangıç durumu
const initialState = {
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE,
};

// Pagination slice
export const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    // Sayfa değiştirmek için action
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    // Sayfa başına öğe sayısını değiştirmek için action (isteğe bağlı)
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },

    // Pagination'ı sıfırlamak için action
    resetPagination: (state) => {
      state.currentPage = 1;
    },
  },
});

// Action creators
export const { setCurrentPage, setItemsPerPage, resetPagination } =
  paginationSlice.actions;

// Selectors
export const selectPaginationState = (state) => state.pagination;
export const selectCurrentPage = (state) => state.pagination.currentPage;
export const selectItemsPerPage = (state) => state.pagination.itemsPerPage;

// Bir sayfa için verileri kesmek için selector
export const selectPaginatedData = (data, page, itemsPerPage) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
};

export default paginationSlice.reducer;
