import { Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'
import CompletionDashboard from '../pages/CompletionDashboard'
import Dashboard from '../pages/Dashboard'
import CreateEvent from '../pages/CreateEvent'
import Generus from '../pages/Generus'
import Login from '../pages/Login'
import Profile from '../pages/Profile'
import RegisterOptions from '../pages/RegisterOptions'

function MainLayout() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/users' element={<Generus />} />
        <Route path='/completion' element={<CompletionDashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<RegisterOptions />} />
        <Route path='/events' element={<CreateEvent />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default MainLayout
