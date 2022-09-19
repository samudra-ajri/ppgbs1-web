import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import presenceService from './presenceService'

const initialState = {
  presence: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Create presence
export const createPresence = createAsyncThunk(
  'presences/create',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await presenceService.createPresence(data, token)
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

export const presenceSlice = createSlice({
  name: 'presence',
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
      .addCase(createPresence.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createPresence.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.presence = action.payload
      })
      .addCase(createPresence.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = presenceSlice.actions
export default presenceSlice.reducer