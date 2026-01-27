import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import materialTargetService from "./materialTargetService"

const initialState = {
  targetIds: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}

// Get target IDs
export const getTargetIds = createAsyncThunk(
  "materialTargets/ids",
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await materialTargetService.getTargetIds(params, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  },
)

export const materialTargetSlice = createSlice({
  name: "materialTargets",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTargetIds.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTargetIds.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.targetIds = action.payload.data
      })
      .addCase(getTargetIds.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = materialTargetSlice.actions
export default materialTargetSlice.reducer
