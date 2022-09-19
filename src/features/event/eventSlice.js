import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import eventService from './eventService'

const initialState = {
  event: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Create event
export const createEvent = createAsyncThunk(
  'events/create',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await eventService.createEvent(data, token)
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

// Get event by id
export const getEvent = createAsyncThunk(
  'events/get',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await eventService.getEvent(id, token)
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

export const eventSlice = createSlice({
  name: 'event',
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
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.event = action.payload
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getEvent.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.event = action.payload
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = eventSlice.actions
export default eventSlice.reducer