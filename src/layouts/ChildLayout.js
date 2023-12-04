import { Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import BackHeader from '../components/BackHeader'
import Footer from '../components/Footer'
import CompletedDetails from '../pages/CompletedDetails'
import CompletedTargets from '../pages/CompletedTargets'
import CreateEvent from '../pages/CreateEvent'
import DetailTargets from '../pages/DetailTargets'
import EventDetails from '../pages/EvenDetails'
import EventPresence from '../pages/EventPresence'
import InputTargets from '../pages/InputTargets'
import Profile from '../pages/Profile'
import Register from '../pages/Register'
import ResetPassword from '../pages/ResetPassword'
import UserCompletionByCategory from '../pages/UserCompletionByCategory'

function ChildLayout() {
  return (
    <>
      <Routes>
        <Route exact path='/details/*' element={<InputTargets />} />
        <Route path='/targets/*' element={<DetailTargets />} />
        <Route path='/user-completion/*' element={<UserCompletionByCategory />} />
        <Route path='/profile/*' element={<><BackHeader title='Profil' /><Profile /></>} />
        <Route path='/targets-completed/*' element={<CompletedTargets />} />
        <Route path='/details-completed/*' element={<CompletedDetails />} />
        <Route path='/register/*' element={<Register />} />
        <Route path='/create-event' element={<CreateEvent />} />
        <Route path='/event-details/*' element={<EventDetails />} />
        <Route path='/event-presence/*' element={<EventPresence />} />
        <Route path='/reset-passwords/*' element={<ResetPassword />} />
      </Routes>
      <Footer />
    </>
  )
}

export default ChildLayout
