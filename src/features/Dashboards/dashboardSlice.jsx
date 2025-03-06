
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import dashboardService from './dashboardService'

const initialState = {
  dashboardData: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get dashboard
export const getDashboard = createAsyncThunk(
  'dashboard',
  async (filters={}, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await dashboardService.getDashboard(filters, token)
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

export const dashboardSlice = createSlice({
  name: 'userCounter',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboard.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.dashboardData = action.payload
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = dashboardSlice.actions
export default dashboardSlice.reducer
