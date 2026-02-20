import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import materialTargetService from "./materialTargetService"

const initialState = {
  targetIds: [],
  groupTargets: [],
  groupTargetsSummary: [],
  groupTargetsSummarySubcategory: [],
  groupTargetsSummaryMaterial: [],
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

// Get group targets
export const getGroupTargets = createAsyncThunk(
  "materialTargets/group",
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await materialTargetService.getGroupTargets(params, token)
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

// Get group targets summary
export const getGroupTargetsSummary = createAsyncThunk(
  "materialTargets/summary",
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await materialTargetService.getGroupTargetsSummary(params, token)
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

// Get group targets summary subcategory
export const getGroupTargetsSummarySubcategory = createAsyncThunk(
  "materialTargets/summarySubcategory",
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await materialTargetService.getGroupTargetsSummarySubcategory(
        params,
        token,
      )
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

// Get group targets summary material
export const getGroupTargetsSummaryMaterial = createAsyncThunk(
  "materialTargets/summaryMaterial",
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await materialTargetService.getGroupTargetsSummaryMaterial(
        params,
        token,
      )
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

// Create material targets
export const createMaterialTargets = createAsyncThunk(
  "materialTargets/create",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await materialTargetService.createMaterialTargets(data, token)
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

// Delete material targets
export const deleteMaterialTargets = createAsyncThunk(
  "materialTargets/delete",
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await materialTargetService.deleteMaterialTargets(params, token)
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
      .addCase(getGroupTargets.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getGroupTargets.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.groupTargets = action.payload.data
      })
      .addCase(getGroupTargets.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getGroupTargetsSummary.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getGroupTargetsSummary.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.groupTargetsSummary = action.payload.data
      })
      .addCase(getGroupTargetsSummary.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getGroupTargetsSummarySubcategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getGroupTargetsSummarySubcategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.groupTargetsSummarySubcategory = action.payload.data
      })
      .addCase(getGroupTargetsSummarySubcategory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getGroupTargetsSummaryMaterial.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getGroupTargetsSummaryMaterial.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.groupTargetsSummaryMaterial = action.payload.data
      })
      .addCase(getGroupTargetsSummaryMaterial.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createMaterialTargets.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createMaterialTargets.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(createMaterialTargets.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteMaterialTargets.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteMaterialTargets.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(deleteMaterialTargets.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = materialTargetSlice.actions
export default materialTargetSlice.reducer
