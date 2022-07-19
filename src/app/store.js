import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import locationReducer from '../features/locations/locationSlice'
import subjectReducer from '../features/subjects/subjectSlice'
import completionReducer from '../features/completions/completionSlice'
import subjectCategoryReducer from '../features/subjectCategories/subjectCategorySlice'
import subjectDetailsReducer from '../features/subjectDetails/subjectDetailsSlice'
import completionDetailsReducer from '../features/completionDetails/completionDetailsSlice'
import userReducer from '../features/users/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    locations: locationReducer,
    subjects: subjectReducer,
    completions: completionReducer,
    subjectCategories: subjectCategoryReducer,
    subjectDetails: subjectDetailsReducer,
    completionDetails: completionDetailsReducer,
    users: userReducer,
  },
})
