
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

  isErrorCreate: false,
  isSuccessCreate: false,
  isLoadingCreate: false,
}

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

// Delete reference
export const deleteReference = createAsyncThunk(
  'references/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await referenceService.deleteReference(token, id)
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

// Create reference
export const createReference = createAsyncThunk(
  'references/create',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await referenceService.createReference(data, token)
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
      .addCase(deleteReference.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteReference.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.references = state.references.filter(
          (references) => references.id !== action.payload.id
        )
        state.totalCount = state.references.length
      })
      .addCase(deleteReference.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createReference.pending, (state) => {
        state.isLoadingCreate = true
      })
      .addCase(createReference.fulfilled, (state, action) => {
        state.isLoadingCreate = false
        state.isSuccessCreate = true
        state.event = action.payload
      })
      .addCase(createReference.rejected, (state, action) => {
        state.isLoadingCreate = false
        state.isErrorCreate = true
        state.message = action.payload
      })
  },
})

export const { reset } = referenceSlice.actions
export default referenceSlice.reducer
