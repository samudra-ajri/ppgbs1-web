import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import listEventsService from './listEventsService'

const initialState = {
  events: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Create event
export const listEvents = createAsyncThunk(
  'events/list',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await listEventsService.listEvents(token)
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

export const listEventsSlice = createSlice({
  name: 'listEvents',
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
      .addCase(listEvents.pending, (state) => {
        state.isLoading = true
      })
      .addCase(listEvents.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.events = action.payload
      })
      .addCase(listEvents.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = listEventsSlice.actions
export default listEventsSlice.reducer