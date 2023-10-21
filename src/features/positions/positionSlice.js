import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import positionService from './positionService'

const initialState = {
  positions: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get positions
export const getPositions = createAsyncThunk(
  'position/getPositions',
  async (orgId, thunkAPI) => {
    try {
      return await positionService.getPositions(orgId)
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

export const positionSlice = createSlice({
  name: 'position',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPositions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPositions.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.positions = action.payload
      })
      .addCase(getPositions.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = positionSlice.actions
export default positionSlice.reducer
