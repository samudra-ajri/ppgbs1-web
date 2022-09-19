import { Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import EventHeaderCard from '../components/EventHeaderCard'
import { listEvents, listEventsGenerus, reset } from '../features/listEvents/listEventsSlice'

function EventPresence() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { events, isSuccess } = useSelector((state) => state.listEvents)

  useEffect(() => {
    if (!user) navigate('/login')
    if (user.role === 'GENERUS') {
      dispatch(listEventsGenerus())
    } else {
      dispatch(listEvents())
    }
    dispatch(reset())
  }, [user, navigate, dispatch])

  return (
    <>
      <BackHeader title='Kehadiran' />
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Isi Daftar Hadir</Typography>
      {isSuccess && events.events.map(event => <EventHeaderCard key={event._id} event={event} user={user}/>)}
    </>
  )
}

export default EventPresence