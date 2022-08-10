import { Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import BackHeader from '../components/BackHeader'
import Footer from '../components/Footer'
import CompletedDetails from '../pages/CompletedDetails'
import CompletedTargets from '../pages/CompletedTargets'
import DetailTargets from '../pages/DetailTargets'
import InputTargets from '../pages/InputTargets'
import Profile from '../pages/Profile'

function ChildLayout() {
  return (
    <>
      <Routes>
        <Route exact path='/details/*' element={<InputTargets />} />
        <Route path='/targets/*' element={<DetailTargets />} />
        <Route path='/profile/*' element={<><BackHeader title='Profil' /><Profile /></>} />
        <Route path='/targets-completed/*' element={<CompletedTargets />} />
        <Route path='/details-completed/*' element={<CompletedDetails />} />
      </Routes>
      <Footer />
    </>
  )
}

export default ChildLayout
