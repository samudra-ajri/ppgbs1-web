import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import listEventsService from './listEventsService'

const initialState = {
  events: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false
}

// list events admin
export const listEvents = createAsyncThunk(
  'events/list',
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await listEventsService.listEvents(params, token)
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

// list events admin
export const listEventsGenerus = createAsyncThunk(
  'events/list/generus',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await listEventsService.listEventsGenerus(token)
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

// Delete event
export const deleteEvent = createAsyncThunk(
  'events/list/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await listEventsService.deleteEvent(id, token)
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
      state.currentPage = 1
      state.hasNextPage = false
      state.events = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listEvents.pending, (state) => {
        state.isLoading = true
      })
      .addCase(listEvents.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.events = [...state.events, ...action.payload.data]
        state.currentPage = action.payload.currentPage
        state.totalPages = Math.ceil(action.payload.total / action.payload.count)
        state.hasNextPage = action.payload.hasNextPage
      })
      .addCase(listEvents.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.hasNextPage = false
      })
      .addCase(listEventsGenerus.pending, (state) => {
        state.isLoading = true
      })
      .addCase(listEventsGenerus.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.events = action.payload
      })
      .addCase(listEventsGenerus.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.events = state.events.filter(
          (event) => event.id !== action.payload.id
        )
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = listEventsSlice.actions
export default listEventsSlice.reducer