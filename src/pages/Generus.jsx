import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PeopleCard from '../components/PeopleCard'
import { getUsers } from '../features/users/userSlice'

function Generus() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { users } = useSelector((state) => state.users)
  const [filters, setFilters] = useState({ page: 1, limit: 20 })

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getUsers(filters))
  }, [user, filters, navigate, dispatch])

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Daftar Generus</Typography>
      {users.map(user => 
        <PeopleCard 
          key={user._id}
          user={user}
        />
      )}
    </>
  )
}

export default Generus