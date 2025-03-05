import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import organizationService from './organizationService'

// Get organizations from localStorage
const ppd = JSON.parse(localStorage.getItem('ppd'))
const ppk = JSON.parse(localStorage.getItem('ppk'))

const initialState = {
  ppd: ppd ? ppd : null,
  ppk: ppk ? ppk : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get all ppd
export const getppd = createAsyncThunk(
  'organization/getppd',
  async (_, thunkAPI) => {
    try {
      return await organizationService.getppd()
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

// Get all ppk per ppd
export const getppk = createAsyncThunk(
  'organization/getppk',
  async (orgId, thunkAPI) => {
    try {
      return await organizationService.getppk(orgId)
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

export const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getppd.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getppd.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.ppd = action.payload
      })
      .addCase(getppd.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getppk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getppk.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.ppk = action.payload
      })
      .addCase(getppk.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = organizationSlice.actions
export default organizationSlice.reducer
