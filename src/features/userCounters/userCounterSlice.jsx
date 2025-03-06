
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userCounterService from './userCounterService'

const initialState = {
  countList: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get roles counter list
export const getRolesCounter = createAsyncThunk(
  'users/roles',
  async ({ ds, klp }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userCounterService.getRolesCounter(ds, klp, token)
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

export const userCounterSlice = createSlice({
  name: 'userCounter',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRolesCounter.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getRolesCounter.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.countList = action.payload
      })
      .addCase(getRolesCounter.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = userCounterSlice.actions
export default userCounterSlice.reducer
