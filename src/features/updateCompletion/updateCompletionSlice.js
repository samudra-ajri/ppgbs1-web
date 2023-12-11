import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import updateCompletionService from './updateCompletionService'

const initialState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

export const createCompletion = createAsyncThunk(
  'updateCompletion/create',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await updateCompletionService.createCompletion(data, token)
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

export const deleteCompletion = createAsyncThunk(
  'updateCompletion/delete',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await updateCompletionService.deleteCompletion(data, token)
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

export const updateCompletionSlice = createSlice({
  name: 'updateCompletion',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCompletion.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createCompletion.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(createCompletion.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteCompletion.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteCompletion.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(deleteCompletion.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = updateCompletionSlice.actions
export default updateCompletionSlice.reducer