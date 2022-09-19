import { Button, Card, CardContent, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import capitalize from 'capitalize'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createPresence, isPresent, reset } from '../features/presences/presenceSlice'
import translate from '../utils/translate'

function PresenceList(props) {
  const { event } = props
  const [formData, setFormData] = useState({ roomId: event.roomId, passCode: '' })
  const { roomId, passCode } = formData
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.presences
  )

  useEffect(() => {
    if (isError) toast.error(message)
    dispatch(isPresent(event.roomId))
    dispatch(reset())
  }, [isError, isSuccess, message, event.roomId, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const data = {
      roomId,
      passCode,
    }
    dispatch(createPresence(data))
  }

  const eventTime = () => {
    const startDate = moment(event.startDate).format('DD MMM YYYY')
    const startTime = moment(event.startDate).format('HH.mm')
    const startDayName = translate.days(moment(event.startDate).format('dddd'))
    return `${startDayName}, ${startDate} pkl. ${startTime}`
  }

  return (
    <>
      <Card sx={{ mb: 0.5 }} align='center'>
        <CardContent sx={{
          padding: 2,
          '&:last-child': {
            paddingBottom: 2
          }
        }}>
          <Typography variant='h5'>{event.name}</Typography>
          <Typography variant='body2'>{eventTime()}</Typography>
          <Typography variant='h5' pt={2}>23</Typography>
          <Typography variant='body2'>Hadir</Typography>
        </CardContent>
      </Card>


      <Card sx={{ mb: 0.5 }} align='left'>
        <CardContent sx={{
          padding: 2,
          '&:last-child': {
            paddingBottom: 2
          }
        }}>
          <Typography fontSize={10} component='p' color='text.secondary'>Sen, 10:30</Typography>
          <Typography variant='body1'>Samudra Ajri Kifli</Typography>
          <Typography fontSize={10} component='p' color='text.secondary'>{capitalize.words('Margahayu' + ', ' + 'Margahayu Utara')}</Typography>
          <Typography fontSize={10} component='p' color='text.secondary'>{('male' === 'male' ? 'Laki-laki' : 'Perempuan')}</Typography>
        </CardContent>
      </Card>

    </>
  )
}

export default PresenceList