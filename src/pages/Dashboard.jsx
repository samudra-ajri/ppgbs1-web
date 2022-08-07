import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Typography } from '@mui/material'
import { getDashboard } from '../features/Dashboards/dashboardSlice'

function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { dashboardData } = useSelector(state => state.dashboard)

  useEffect(() => {
    if (!user) navigate('/login')
    if (user?.role === 'GENERUS') navigate('/profile')
    dispatch(getDashboard())
  }, [user, navigate, dispatch])
  
  return (
  <>
    <Typography variant='h6' align='center' sx={{ mb: 1 }}>Dashboard</Typography>
  </>
  )
}

export default Dashboard