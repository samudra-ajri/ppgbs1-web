import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProfileCard from '../components/ProfileCard'

function Profile() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  return (
    <ProfileCard />
  )
}

export default Profile