import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import completionService from './completionService'

const initialState = {
  completions: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get user completions
export const getCompletions = createAsyncThunk(
  'completions/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionService.getCompletions(token)
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

// Get user completions by category
export const getCompletionsByCategory = createAsyncThunk(
  'completions/categories/category',
  async (category, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionService.getCompletionsByCategory(category, token)
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

// Get user completions by category and user id
export const getUserCompletionsByCategory = createAsyncThunk(
  'completions/categories/user',
  async ({ title, userId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionService.getUserCompletionsByCategory(title, userId, token)
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

// Get user completions scores
export const getCompletionsScores = createAsyncThunk(
  'completions/scores',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionService.getCompletionsScores(token)
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

// Get all users completions scores
export const getAllCompletionsScores = createAsyncThunk(
  'completions/scores/all',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionService.getAllCompletionsScores(token)
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

// Get user completions scores
export const getCompletionsScoresByUserId = createAsyncThunk(
  'completions/scores/userId',
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionService.getCompletionsScoresByUserId(token, userId)
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

// Get user completions by user id
export const getCompletionsByUserId = createAsyncThunk(
  'completions/userId',
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await completionService.getCompletionsByUserId(token, userId)
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

export const completionSlice = createSlice({
  name: 'completion',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompletions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompletions.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.completions = action.payload
      })
      .addCase(getCompletions.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getCompletionsScores.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompletionsScores.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.completions = action.payload
      })
      .addCase(getCompletionsScores.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getCompletionsScoresByUserId.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompletionsScoresByUserId.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.completions = action.payload
      })
      .addCase(getCompletionsScoresByUserId.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getCompletionsByCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompletionsByCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.completions = action.payload
      })
      .addCase(getCompletionsByCategory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getCompletionsByUserId.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompletionsByUserId.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.completions = action.payload
      })
      .addCase(getCompletionsByUserId.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getUserCompletionsByCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUserCompletionsByCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.completions = action.payload
      })
      .addCase(getUserCompletionsByCategory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getAllCompletionsScores.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllCompletionsScores.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.completions = action.payload
      })
      .addCase(getAllCompletionsScores.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = completionSlice.actions
export default completionSlice.reducer
