import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProfileCard from '../components/ProfileCard'
import TargetCard from '../components/TargetCard'
import { Typography } from '@mui/material'

function Profile() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  return (
    <>
      <ProfileCard user={user} />
      <Typography variant="h6">
        Target
      </Typography>
      <TargetCard />
      <TargetCard />
    </>
  )
}

export default Profile