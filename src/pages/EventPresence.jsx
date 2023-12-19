import { Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import PresenceForm from '../components/PresenceForm'
import { getEvent, reset } from '../features/event/eventSlice'

function EventPresence() {
  const eventId = window.location.pathname.split('/')[3]
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { event, isSuccess } = useSelector((state) => state.events)

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getEvent(eventId))
    dispatch(reset())
  }, [user, eventId, navigate, dispatch])

  return (
    <>
      <BackHeader title='Kehadiran' />
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Isi Daftar Hadir</Typography>
      {isSuccess && <>
        <PresenceForm event={event.data} user={user} />
      </>}
    </>
  )
}

export default EventPresence