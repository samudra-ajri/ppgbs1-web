
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import personService from './personService'

const person = JSON.parse(localStorage.getItem('person'))

const initialState = {
  person: person ? person : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get user by id
export const getUserById = createAsyncThunk(
  'person/getOne',
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await personService.getUserById(token, userId)
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
        state.person = action.payload.data
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
