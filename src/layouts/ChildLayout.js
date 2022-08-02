import { Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import BackHeader from '../components/BackHeader'
import Footer from '../components/Footer'
import DetailTargets from '../pages/DetailTargets'
import InputTargets from '../pages/InputTargets'
import Profile from '../pages/Profile'

function ChildLayout() {
  return (
    <>
      <Routes>
        <Route exact path='/details/*' element={<InputTargets />} />
        <Route path='/targets/*' element={<DetailTargets />} />
        <Route path='/profile/*' element={<><BackHeader title='Profil Generus' /><Profile /></>} />
        <Route path='/targets-completed/*' element={<><BackHeader title='Target Tercapai' /><Profile /></>} />
      </Routes>
      <Footer />
    </>
  )
}

export default ChildLayout
