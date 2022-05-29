import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import locationReducer from '../features/locations/locationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    locations: locationReducer
  },
})
