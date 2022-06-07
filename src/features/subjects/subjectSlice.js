import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import subjectService from './subjectService'

const initialState = {
  subjects: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get all subjects
export const getSubjects = createAsyncThunk(
  'subjects/getAll',
  async (_, thunkAPI) => {
    try {
      return await subjectService.getSubjects()
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

export const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubjects.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getSubjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.subjects = action.payload
      })
      .addCase(getSubjects.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = subjectSlice.actions
export default subjectSlice.reducer
