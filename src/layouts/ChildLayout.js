import { Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import DetailTargets from '../pages/DetailTargets'
import InputTargets from '../pages/InputTargets'

function ChildLayout() {
  return (
    <>
      <Routes>
        <Route exact path='/detail/*' element={<InputTargets />} />
        <Route path='/targets/*' element={<DetailTargets path={window.location.pathname} />} />
      </Routes>
    </>
  )
}

export default ChildLayout
