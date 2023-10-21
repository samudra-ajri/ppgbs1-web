import { Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'
import CompletionDashboard from '../pages/CompletionDashboard'
import Dashboard from '../pages/Dashboard'
import Generus from '../pages/Generus'
import Login from '../pages/Login'
import Profile from '../pages/Profile'
import Register from '../pages/Register'
import Event from '../pages/Event'
import EditProfile from '../pages/EditProfile'
import FortgotPassword from '../pages/FortgotPassword'
import Menu from '../pages/Menu'
import ResetPasswordList from '../pages/ResetPasswordList'
import DecidePosition from '../pages/DecidePosition'

function MainLayout() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/profile/edit' element={<EditProfile />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/users' element={<Generus />} />
        <Route path='/completion' element={<CompletionDashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<FortgotPassword />} />
        <Route path='/register' element={<Register />} />
        <Route path='/events' element={<Event />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/reset-passwords' element={<ResetPasswordList />} />
        <Route path='/decide-position' element={<DecidePosition />} />
        <Route path='/' element={<Menu />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default MainLayout
