import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import completionScoreService from './completionScoreService'

const initialState = {
  completionScores: {},
  sumCompletions: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get all users completions scores
export const getAllCompletionsScores = createAsyncThunk(
  'completions/scores/all',
  async (filters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionScoreService.getAllCompletionsScores(filters, token)
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

// Get sum users completions
export const getSumCompletions = createAsyncThunk(
  'completions/sumCompletions',
  async (filters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionScoreService.getSumCompletions(token, filters)
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

// Get group sum completions
export const getGroupSumCompletions = createAsyncThunk(
  'completions/sumGroupCompletions',
  async (filters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionScoreService.getGroupSumCompletions(token, filters)
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

export const completionScoreSlice = createSlice({
  name: 'completion',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCompletionsScores.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllCompletionsScores.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.completionScores = action.payload
      })
      .addCase(getAllCompletionsScores.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getSumCompletions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getSumCompletions.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.sumCompletions = action.payload.data
      })
      .addCase(getSumCompletions.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getGroupSumCompletions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getGroupSumCompletions.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.sumCompletions = action.payload.data
      })
      .addCase(getGroupSumCompletions.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = completionScoreSlice.actions
export default completionScoreSlice.reducer
