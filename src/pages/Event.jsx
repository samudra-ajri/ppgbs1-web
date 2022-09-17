import { Button, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import EventCard from '../components/EventCard'
import { listEvents, reset } from '../features/listEvents/listEventsSlice'

function Event() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { events, isSuccess } = useSelector((state) => state.listEvents)

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(listEvents())
    dispatch(reset())
  }, [user, navigate, dispatch])

  const onClick = () => {
    navigate('/c/create-event')
  }

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Jadwal Kegiatan</Typography>
      <Button size="medium" style={{ margin: "20px auto" }} type="submit" variant="contained" color="info" fullWidth onClick={onClick}>Tambah</Button>
      {isSuccess && events.events.map(event => <EventCard key={event._id} event={event} />)}
    </>
  )
}

export default Event