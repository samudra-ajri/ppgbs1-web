import { Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import Footer from '../components/Footer'
import DetailTargets from '../pages/DetailTargets'
import InputTargets from '../pages/InputTargets'

function ChildLayout() {
  return (
    <>
      <Routes>
        <Route exact path='/details/*' element={<InputTargets />} />
        <Route path='/targets/*' element={<DetailTargets />} />
      </Routes>
      <Footer />
    </>
  )
}

export default ChildLayout
