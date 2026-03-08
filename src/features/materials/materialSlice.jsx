import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import materialService from "./materialService"

const initialState = {
  materials: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}

// Search materials
export const searchMaterials = createAsyncThunk(
  "materials/search",
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await materialService.searchMaterials(params, token)
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

export const materialSlice = createSlice({
  name: "materials",
  initialState,
  reducers: {
    resetMaterials: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ""
      state.materials = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMaterials.pending, (state) => {
        state.isLoading = true
      })
      .addCase(searchMaterials.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.materials = action.payload.data
      })
      .addCase(searchMaterials.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.materials = []
      })
  },
})

export const { resetMaterials } = materialSlice.actions
export default materialSlice.reducer
