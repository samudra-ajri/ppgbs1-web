import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Typography } from '@mui/material'

function Dashboard() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) navigate('/login')
    if (user?.role === 'GENERUS') navigate('/profile')
  }, [user, navigate])
  
  return (
  <>
    <Typography variant='h6' align='center' sx={{ mb: 1 }}>Dashboard</Typography>
  </>
  )
}

export default Dashboard