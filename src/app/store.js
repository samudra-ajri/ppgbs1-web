import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import locationReducer from '../features/locations/locationSlice'
import subjectReducer from '../features/subjects/subjectSlice'
import completionReducer from '../features/completions/completionSlice'
import subjectCategoryReducer from '../features/subjectCategories/subjectCategorySlice'
import subjectDetailsReducer from '../features/subjectDetails/subjectDetailsSlice'
import completionDetailsReducer from '../features/completionDetails/completionDetailsSlice'
import completionScoresReducer from '../features/completionScores/completionScoreSlice'
import userReducer from '../features/users/userSlice'
import userCounterReducer from '../features/userCounters/userCounterSlice'
import personReducer from '../features/persons/personSlice'
import completedTargetReducer from '../features/targetCompleted/targetCompletedSlice'
import dashboardReducer from '../features/Dashboards/dashboardSlice'
import eventReducer from '../features/event/eventSlice'
import listEventsReducer from '../features/listEvents/listEventsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    locations: locationReducer,
    subjects: subjectReducer,
    completions: completionReducer,
    subjectCategories: subjectCategoryReducer,
    subjectDetails: subjectDetailsReducer,
    completionDetails: completionDetailsReducer,
    completionScores: completionScoresReducer,
    users: userReducer,
    usersCounter: userCounterReducer,
    persons: personReducer,
    completedTargets: completedTargetReducer,
    dashboard: dashboardReducer,
    events: eventReducer,
    listEvents: listEventsReducer
  },
})
