import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import completionScoreService from './completionScoreService'

const initialState = {
  completionScores: {},
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
  },
})

export const { reset } = completionScoreSlice.actions
export default completionScoreSlice.reducer
