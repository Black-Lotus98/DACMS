import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { savedQueriesSeed, searchResultsSeed } from '../data';
import type { SearchFilters, SearchState, SavedQuery } from '../types';

const initialState: SearchState = {
  filters:      { query: '' },
  results:      searchResultsSeed,
  savedQueries: savedQueriesSeed,
  barcodeQuery: '',
  loading:      false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<SearchFilters>) {
      state.filters = action.payload;
    },

    setResults(state, action: PayloadAction<SearchState['results']>) {
      state.results = action.payload;
    },

    setBarcodeQuery(state, action: PayloadAction<string>) {
      state.barcodeQuery = action.payload;
    },

    addSavedQuery(state, action: PayloadAction<SavedQuery>) {
      state.savedQueries.unshift(action.payload);
    },

    deleteSavedQuery(state, action: PayloadAction<string>) {
      state.savedQueries = state.savedQueries.filter((q) => q.id !== action.payload);
    },
  },
});

export const { setFilters, setResults, setBarcodeQuery, addSavedQuery, deleteSavedQuery } =
  searchSlice.actions;
export default searchSlice.reducer;
