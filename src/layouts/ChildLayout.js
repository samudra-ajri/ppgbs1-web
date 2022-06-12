import { Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import BackHeader from '../components/BackHeader'
import DetailTargets from '../pages/DetailTargets'

function ChildLayout() {
  return (
    <>
      <BackHeader />
      <Routes>
        <Route path='/targets' element={<DetailTargets />} />
      </Routes>
    </>
  )
}

export default ChildLayout
