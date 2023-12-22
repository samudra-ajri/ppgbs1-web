
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from './userService'

const initialState = {
  users: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  totalCount: 0
}

// Get users list
export const getUsers = createAsyncThunk(
  'users/getAll',
  async ({page, search, role, needresetpassword}, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.getUsers(token, page, search, role, needresetpassword)
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
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.getUsers(token, params)
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
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await userService.deleteUser(token, params)
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
        state.users = [...state.users, ...action.payload.data]
        state.currentPage = action.payload.currentPage
        state.totalPages = Math.ceil(action.payload.total / action.payload.count)
        state.hasNextPage = action.payload.hasNextPage
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.hasNextPage = false
      })
      .addCase(getUsersPaginate.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUsersPaginate.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = [...state.users, ...action.payload.data]
        state.totalCount = action.payload.total
        state.hasNextPage = action.payload.hasNextPage
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
          (user) => user.id !== action.payload.userId
        )
        state.totalCount = state.users.length
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
