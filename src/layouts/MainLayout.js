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

function MainLayout() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/generus' element={<Generus />} />
        <Route path='/completion' element={<CompletionDashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default MainLayout
