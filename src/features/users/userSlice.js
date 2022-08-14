
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from './userService'

const initialState = {
  users: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get users list
export const getUsers = createAsyncThunk(
  'users/getAll',
  async ({page, search, role}, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.getUsers(token, page, search, role)
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

// Get users list with paginate
export const getUsersPaginate = createAsyncThunk(
  'users/getPaginate',
  async ({page, search, role}, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.getUsers(token, page, search, role)
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

// Delete user
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.deleteUser(token, userId)
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

// Move user (change user ds/klp to moving status it means nonactive user)
export const moveUser = createAsyncThunk(
  'users/move',
  async ({ userId, data }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.updateUser(token, userId, data)
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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = action.payload.users
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getUsersPaginate.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUsersPaginate.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = [...state.users, ...action.payload.users]
      })
      .addCase(getUsersPaginate.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = state.users.filter(
          (user) => user._id !== action.payload.id
        )
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(moveUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(moveUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = state.users.filter(
          (user) => user._id !== action.payload._id
        )
      })
      .addCase(moveUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = userSlice.actions
export default userSlice.reducer
