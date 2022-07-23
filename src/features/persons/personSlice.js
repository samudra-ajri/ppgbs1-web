
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import personService from './personService'

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get user by id
export const getUserById = createAsyncThunk(
  'user/getOne',
  async (suerId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await personService.getUserById(token, suerId)
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

export const personSlice = createSlice({
  name: 'person',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = personSlice.actions
export default personSlice.reducer
