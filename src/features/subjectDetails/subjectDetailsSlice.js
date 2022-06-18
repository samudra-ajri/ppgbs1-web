import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import subjectDetailsService from './subjectDetailsService'

const initialState = {
  subjectDetails: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get subjects by id
export const getSubject = createAsyncThunk(
  'subjects/getById',
  async (id, thunkAPI) => {
    try {
      return await subjectDetailsService.getSubject(id)
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

export const subjectCategorySlice = createSlice({
  name: 'subjectDetail',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubject.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getSubject.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.subjectDetails = action.payload
      })
      .addCase(getSubject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = subjectCategorySlice.actions
export default subjectCategorySlice.reducer
