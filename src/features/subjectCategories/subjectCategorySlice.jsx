import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import subjectCategoryService from './subjectCategoryService'

const initialState = {
  subjectCategories: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get all subject categories
export const getSubjectCategories = createAsyncThunk(
  'subjects/count/categories',
  async (_, thunkAPI) => {
    try {
      return await subjectCategoryService.getSubjectCategories()
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const subjectCategorySlice = createSlice({
  name: 'subjectCategory',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubjectCategories.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getSubjectCategories.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.subjectCategories = action.payload
      })
      .addCase(getSubjectCategories.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = subjectCategorySlice.actions
export default subjectCategorySlice.reducer
