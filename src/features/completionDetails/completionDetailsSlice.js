import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import completionDetailsService from './completionDetailsService'

const initialState = {
  completionDetails: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get user completion by subject id
export const getCompletionBySubjectId = createAsyncThunk(
  'completions/getById',
  async (subjectId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionDetailsService.getCompletionBySubjectId(subjectId, token)
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

export const completionDetailSlice = createSlice({
  name: 'completionDetail',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompletionBySubjectId.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompletionBySubjectId.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.completionDetails = action.payload
      })
      .addCase(getCompletionBySubjectId.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = completionDetailSlice.actions
export default completionDetailSlice.reducer
