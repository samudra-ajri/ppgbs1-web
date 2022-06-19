import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import completionDetailsService from './completionDetailsService'

const initialState = {
  completions: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get user completion by id
export const getCompletionsById = createAsyncThunk(
  'completions/getById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionDetailsService.getCompletion(id, token)
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
      .addCase(getCompletionsById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompletionsById.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.completions = action.payload
      })
      .addCase(getCompletionsById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = completionDetailSlice.actions
export default completionDetailSlice.reducer
