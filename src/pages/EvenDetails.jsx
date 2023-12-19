import { Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import PresenceList from '../components/PresenceList'
import { getEvent, reset } from '../features/event/eventSlice'

function EventPresence() {
  const location = useLocation()
  const eventId = (location.pathname.split('/'))[3]

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { event, isSuccess } = useSelector((state) => state.events)

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getEvent(eventId))
    return () => {
      dispatch(reset())
    }
  }, [user, eventId, navigate, dispatch])

  return (
    <>
      <BackHeader title='Kehadiran' />
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Daftar Hadir</Typography>
      {isSuccess && <>
        <PresenceList event={event.data} user={user} />
      </>}
    </>
  )
}

export default EventPresence