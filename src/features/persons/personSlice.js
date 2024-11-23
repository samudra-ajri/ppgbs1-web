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

// Update student by admin
export const updateStudentByAdmin = createAsyncThunk(
  'person/updateStudentByAdmin',
  async ({ userId, payload }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await personService.updateStudentByAdmin(token, userId, payload)
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
    reset: (state) => {
      // Reset state and clear localStorage
      localStorage.removeItem('person')
      return initialState
    },
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

        // Update localStorage when user data is fetched successfully
        localStorage.setItem('person', JSON.stringify(action.payload.data))
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateStudentByAdmin.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true

        const updatedGrade = action.meta.arg.payload.grade
        if (state.person) {
          state.person.grade = updatedGrade

          // Keep localStorage in sync with updated grade
          localStorage.setItem('person', JSON.stringify(state.person))
        }
      })
  },
})


export const { reset } = personSlice.actions
export default personSlice.reducer
