import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  initialData: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
}

export const initialSlice = createSlice({
  name: 'initialData',
  initialState,
  reducers: {
    createInitialData: (state, action) => {
      state.initialData = action.payload
      state.isSuccess = true
    },
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
    },
  },
})

export const { createInitialData, reset } = initialSlice.actions
export default initialSlice.reducer
