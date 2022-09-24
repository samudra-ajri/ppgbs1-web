import { Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'
import CompletionDashboard from '../pages/CompletionDashboard'
import Dashboard from '../pages/Dashboard'
import Generus from '../pages/Generus'
import Login from '../pages/Login'
import Profile from '../pages/Profile'
import RegisterOptions from '../pages/RegisterOptions'
import Event from '../pages/Event'
import EditProfile from '../pages/EditProfile'

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
        <Route path='/events' element={<Event />} />
        <Route path='/profile/edit' element={<EditProfile />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default MainLayout
