import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import locationReducer from '../features/locations/locationSlice'
import subjectReducer from '../features/subjects/subjectSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    locations: locationReducer,
    subjects: subjectReducer
  },
})
