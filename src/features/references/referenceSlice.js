
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import referenceService from './referenceService'

const initialState = {
  references: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  totalCount: 0,
}

// Get references list
export const getReferences = createAsyncThunk(
  'references/getAll',
  async ({ page, search }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await referenceService.getReferences(token, page, search)
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

// Get references list with paginate
export const getReferencesPaginate = createAsyncThunk(
  'references/getPaginate',
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await referenceService.getReferences(token, params)
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

export const referenceSlice = createSlice({
  name: 'references',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReferences.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getReferences.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.references = [...state.references, ...action.payload.data]
        state.currentPage = action.payload.currentPage
        state.totalPages = Math.ceil(action.payload.total / action.payload.count)
        state.hasNextPage = action.payload.hasNextPage
      })
      .addCase(getReferences.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.hasNextPage = false
      })
      .addCase(getReferencesPaginate.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getReferencesPaginate.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.references = [...state.references, ...action.payload.data]
        state.totalCount = action.payload.total
        state.hasNextPage = action.payload.hasNextPage
      })
      .addCase(getReferencesPaginate.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = referenceSlice.actions
export default referenceSlice.reducer
