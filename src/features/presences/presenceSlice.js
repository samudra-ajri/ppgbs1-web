import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import presenceService from './presenceService'

const initialState = {
  presence: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',

  isSuccessPresentStatus: false,
  isLoadingPresentStatus: false,
  isSuccessCreatePresence: false,
  isPresentStatus: null,

  attenders: [],
  isErrorAttenders: false,
  isSuccessAttenders: false,
  isLoadingAttenders: false,
  messageAttenders: '',
  attendersCount: 0,
  statusCount: null,
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,

  isSuccessUpdate: false,
  isLoadingUpdate: false,

  isDownloading: false,
  downloadError: null,
}

// Create presence
export const createPresence = createAsyncThunk(
  'presences/create',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await presenceService.createPresence(data, token)
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

// Create presence by admin
export const createPresenceByAdmin = createAsyncThunk(
  'presences/createByAdmin',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await presenceService.createPresenceByAdmin(data, token)
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

// Create remove attender
export const removeAttender = createAsyncThunk(
  'presences/removeAttender',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await presenceService.removeAttender(data, token)
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

// Check user presence status
export const isPresent = createAsyncThunk(
  'presences/detail',
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await presenceService.detail(params, token)
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

// Get presence by roomId
export const getPresencesByEventId = createAsyncThunk(
  'presences/attenders',
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await presenceService.getPresencesByEventId(token, params)
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

// Get presence by roomId list with paginate
export const getPresencesByRoomIdPaginate = createAsyncThunk(
  'presences/attendersPaginate',
  async ({ page, roomId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await presenceService.getPresencesByRoomId({ page, roomId }, token)
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

// Download presence data as Excel
export const downloadPresenceData = createAsyncThunk(
  'presences/download',
  async ({ eventId, params }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const data = await presenceService.downloadPresenceData(eventId, token, params)
      return data // This will be a blob
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

export const updatePresence = createAsyncThunk(
  'presences/updatePresence',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await presenceService.updatePresence(data, token)
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

export const presenceSlice = createSlice({
  name: 'presence',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
      state.isSuccessPresentStatus = false
      state.isLoadingPresentStatus = false
      state.isSuccessCreatePresence = false

      state.isLoadingAttenders = false
      state.isSuccessAttenders = false
      state.isErrorAttenders = false
      state.messageAttenders = ''
      state.currentPage = 1
      state.totalPages = 1
      state.hasNextPage = false
      state.attenders = []
      state.attendersCount = 0
      state.statusCount = null

      state.isSuccessUpdate = false
      state.isLoadingUpdate = false

    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPresence.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createPresence.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.presence = action.payload
      })
      .addCase(createPresence.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createPresenceByAdmin.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createPresenceByAdmin.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessCreatePresence = true
        state.presence = action.payload
      })
      .addCase(createPresenceByAdmin.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(isPresent.pending, (state) => {
        state.isLoadingPresentStatus = true
      })
      .addCase(isPresent.fulfilled, (state, action) => {
        state.isLoadingPresentStatus = false
        state.isSuccessPresentStatus = true
        state.isPresentStatus = action.payload
      })
      .addCase(isPresent.rejected, (state, action) => {
        state.isLoadingPresentStatus = false
        state.isPresentStatus = null
      })
      .addCase(getPresencesByEventId.pending, (state) => {
        state.isLoadingAttenders = true
      })
      .addCase(getPresencesByEventId.fulfilled, (state, action) => {
        state.isLoadingAttenders = false
        state.isSuccessAttenders = true
        state.attenders = [...state.attenders, ...action.payload.data]
        state.attendersCount = action.payload.total
        state.statusCount = action.payload.totalStatus
        state.currentPage = action.payload.currentPage
        state.totalPages = Math.ceil(action.payload.total / action.payload.count)
        state.hasNextPage = action.payload.hasNextPage
      })
      .addCase(getPresencesByEventId.rejected, (state, action) => {
        state.isLoadingAttenders = false
        state.isErrorAttenders = true
        state.messageAttenders = action.payload
        state.hasNextPage = false
      })
      .addCase(getPresencesByRoomIdPaginate.pending, (state) => {
        state.isLoadingAttenders = true
      })
      .addCase(getPresencesByRoomIdPaginate.fulfilled, (state, action) => {
        state.isLoadingAttenders = false
        state.isSuccessAttenders = true
        state.attenders = [...state.attenders, ...action.payload.attenders]
      })
      .addCase(getPresencesByRoomIdPaginate.rejected, (state, action) => {
        state.isLoadingAttenders = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(removeAttender.pending, (state) => {
        state.isLoading = true
      })
      .addCase(removeAttender.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.attenders = state.attenders.filter(
          (attender) => attender.userId !== action.payload.userId
        )
        state.attendersCount = state.attenders.length
      })
      .addCase(removeAttender.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(downloadPresenceData.pending, (state) => {
        state.isDownloading = true
        state.downloadError = null
      })
      .addCase(downloadPresenceData.fulfilled, (state) => {
        state.isDownloading = false
      })
      .addCase(downloadPresenceData.rejected, (state, action) => {
        state.isDownloading = false
        state.downloadError = action.payload
      })
      .addCase(updatePresence.pending, (state) => {
        state.isLoadingUpdate = true
      })
      .addCase(updatePresence.rejected, (state, action) => {
        state.isLoadingUpdate = false
        state.isSuccessUpdate = false
      })
      .addCase(updatePresence.fulfilled, (state, action) => {
        state.isLoadingUpdate = false
        state.isSuccessUpdate = true

        // Find the index of the attender and update their status
        const index = state.attenders.findIndex(
          (attender) => attender.userId === action.meta.arg.userId
        )

        if (index !== -1) {
          const previousStatus = state.attenders[index].status
          const newStatus = action.meta.arg.status

          // Update attender's status
          state.attenders[index].status = newStatus

          // Update the status count
          if (previousStatus !== newStatus) {
            if (previousStatus === "IZIN") {
              state.statusCount.izin -= 1
            } else if (previousStatus === "HADIR") {
              state.statusCount.hadir -= 1
            } else if (previousStatus === "ALPA") {
              state.statusCount.alpa -= 1
            }

            if (newStatus === "IZIN") {
              state.statusCount.izin += 1
            } else if (newStatus === "HADIR") {
              state.statusCount.hadir += 1
            } else if (newStatus === "ALPA") {
              state.statusCount.alpa += 1
            }
          }
        }
      })
  },
})

export const { reset } = presenceSlice.actions
export default presenceSlice.reducer