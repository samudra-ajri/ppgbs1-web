import { Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import BackHeader from '../components/BackHeader'
import CompletedDetails from '../pages/CompletedDetails'
import CompletedTargets from '../pages/CompletedTargets'
import CreateEvent from '../pages/CreateEvent'
import DetailTargets from '../pages/DetailTargets'
import EventDetails from '../pages/EvenDetails'
import EventPresence from '../pages/EventPresence'
import EventGroupPresence from '../pages/EventGroupPresence'
import InputTargets from '../pages/InputTargets'
import Profile from '../pages/Profile'
import Register from '../pages/Register'
import ResetPassword from '../pages/ResetPassword'
import UserCompletionByCategory from '../pages/UserCompletionByCategory'
import InputCompletion from '../pages/InputCompletion'
import PersonCompletion from '../pages/PersonCompletion'
import PersonCompletionByCategory from '../pages/PersonCompletionByCategory'
import PersonInputCompletion from '../pages/PersonInputCompletion'
import GroupCompletionByCategory from '../pages/GroupCompletionByCategory'
import GroupInputCompletion from '../pages/GroupInputCompletion'
import EditProfile from '../pages/EditProfile'
import EditGrade from '../pages/EditGrade'
import UpdatePassword from '../pages/UpdatePassword'
import CreateReference from '../pages/CreateReference'
import RegisterByAdmin from '../pages/RegisterByAdmin'
import { Container } from '@mui/material'
import EditKemuballighan from '../pages/EditKemuballighan'

function ChildLayout() {
  return (
    <>
      <Container maxWidth="sm" sx={{ pt: 11 }}>
        <Routes>
          <Route exact path='/details/*' element={<InputTargets />} />
          <Route exact path='/detail-completion/*' element={<InputCompletion />} />
          <Route path='/targets/*' element={<DetailTargets />} />
          <Route path='/user-completion/*' element={<UserCompletionByCategory />} />
          <Route path='/group-completion/*' element={<GroupCompletionByCategory />} />
          <Route exact path='/group-detail-completion/*' element={<GroupInputCompletion />} />
          <Route path='/person-completion/*' element={<PersonCompletionByCategory />} />
          <Route path='/person-completion' element={
            <>
              <BackHeader title='Capaian User' />
              <PersonCompletion />
            </>} />
          <Route exact path='/person-detail-completion/*' element={<PersonInputCompletion />} />
          <Route path='/profile/*' element={
            <>
              <BackHeader title='Profil' />
              <Profile />
            </>} />
          <Route path='/targets-completed/*' element={<CompletedTargets />} />
          <Route path='/details-completed/*' element={<CompletedDetails />} />
          <Route path='/register/*' element={<Register />} />
          <Route path='/register-by-admin' element={<RegisterByAdmin />} />
          <Route path='/create-event' element={<CreateEvent />} />
          <Route path='/event-details/*' element={<EventDetails />} />
          <Route path='/event-presence/*' element={<EventPresence />} />
          <Route path='/event-group-presence/*' element={<EventGroupPresence />} />
          <Route path='/reset-passwords/*' element={<ResetPassword />} />
          <Route path='/edit-profile' element={<EditProfile />} />
          <Route path='/edit-grade' element={<EditGrade />} />
          <Route path='/edit-kemuballighan' element={<EditKemuballighan />} />
          <Route path='/update-password' element={<UpdatePassword />} />
          <Route path='/create-reference' element={<CreateReference />} />
        </Routes>
      </Container>
    </>
  )
}

export default ChildLayout
