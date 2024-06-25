import { Routes, Route, useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'
import CompletionDashboard from '../pages/CompletionDashboard'
import Dashboard from '../pages/Dashboard'
import Generus from '../pages/Generus'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Event from '../pages/Event'
import FortgotPassword from '../pages/FortgotPassword'
import Menu from '../pages/Menu'
import ResetPasswordList from '../pages/ResetPasswordList'
import DecidePosition from '../pages/DecidePosition'
import UserCompletion from '../pages/UserCompletion'
import GroupCompletion from '../pages/GroupCompletion'
import Profile from '../pages/Profile'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import References from '../pages/References'

function MainLayout() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    const isChangeTempPassword =
      user?.needUpdatePassword && user?.resetPasswordToken

    if (now >= user?.exp) navigate("/login")
    if (isChangeTempPassword) navigate("/c/update-password")
  }, [user, navigate])

  return (
    <>
      <Header />
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/users' element={<Generus />} />
        <Route path='/completion' element={<CompletionDashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/user-completion' element={<UserCompletion />} />
        <Route path='/group-completion' element={<GroupCompletion />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<FortgotPassword />} />
        <Route path='/register' element={<Register />} />
        <Route path='/events' element={<Event />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/reset-passwords' element={<ResetPasswordList />} />
        <Route path='/decide-position' element={<DecidePosition />} />
        <Route path='/references' element={<References />} />
        <Route path='/' element={<Menu />} />
      </Routes>
      <Footer />
      <BottomNav />
    </>
  )
}

export default MainLayout
