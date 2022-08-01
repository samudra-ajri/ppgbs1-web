import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import targetCompletedService from './targetCompletedService'

const initialState = {
  completedTargets: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get all completions subject scores
export const getAllCompletionsSubjectScores = createAsyncThunk(
  'completedTargets/subject',
  async ({ subjectId, ds, klp }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await targetCompletedService.getAllCompletionsSubjectScores(subjectId, ds, klp, token)
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

export const targetCompletedSlice = createSlice({
  name: 'completedTargets',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCompletionsSubjectScores.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllCompletionsSubjectScores.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.completedTargets = action.payload
      })
      .addCase(getAllCompletionsSubjectScores.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = targetCompletedSlice.actions
export default targetCompletedSlice.reducer
