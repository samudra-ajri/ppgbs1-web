import { Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import DetailTargets from '../pages/DetailTargets'

function ChildLayout() {
  return (
    <>
      <Routes>
        <Route path='/targets/*' element={<DetailTargets path={window.location.pathname} />} />
      </Routes>
    </>
  )
}

export default ChildLayout
