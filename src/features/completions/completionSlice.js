import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import completionService from './completionService'

const initialState = {
  completions: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get user completions
export const getCompletions = createAsyncThunk(
  'completions/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionService.getCompletions(token)
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

// Get user completions scores
export const getCompletionsByCategory = createAsyncThunk(
  'completions/categories/category',
  async (category, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionService.getCompletionsByCategory(category, token)
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

// Get user completions scores
export const getCompletionsScores = createAsyncThunk(
  'completions/scores',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionService.getCompletionsScores(token)
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

export const completionSlice = createSlice({
  name: 'completion',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompletions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompletions.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.completions = action.payload
      })
      .addCase(getCompletions.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getCompletionsScores.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompletionsScores.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.completions = action.payload
      })
      .addCase(getCompletionsScores.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getCompletionsByCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompletionsByCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.completions = action.payload
      })
      .addCase(getCompletionsByCategory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = completionSlice.actions
export default completionSlice.reducer
