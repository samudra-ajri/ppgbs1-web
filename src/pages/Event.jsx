import { Button, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import EventCard from '../components/EventCard'
import { listEvents, listEventsGenerus, reset } from '../features/listEvents/listEventsSlice'

function Event() {
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

  const onClick = () => {
    navigate('/c/create-event')
  }

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Jadwal Kegiatan</Typography>
      {(user.role !== 'GENERUS' && user.role !=='MT' && user.role !=='MS') && <Button size="medium" style={{ margin: "20px auto" }} type="submit" variant="contained" color="info" fullWidth onClick={onClick}>Tambah</Button>}
      {isSuccess && events.events?.map(event => <EventCard key={event._id} event={event} user={user}/>)}
      {isSuccess && events.events?.length === 0 && <Typography textAlign='center' pt={3} color='text.secondary' variant='body2'>Belum ada kegiatan.</Typography>}
    </>
  )
}

export default Event