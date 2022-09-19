import { Button, Card, CardContent, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createPresence, isPresent, reset } from '../features/presences/presenceSlice'
import translate from '../utils/translate'
import CheckIcon from '@mui/icons-material/CheckCircleOutlineRounded';

function PresenceForm(props) {
  const { event } = props
  const [formData, setFormData] = useState({ roomId: event.roomId, passCode: '' })
  const { roomId, passCode } = formData
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isLoading, isError, isSuccess, message, isPresentStatus } = useSelector(
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
          { isPresentStatus && <>
            <Typography pt={3} color='green'><CheckIcon fontSize='large' /></Typography>
            <Typography variant='h5'>Hadir</Typography>
          </> }
        </CardContent>
      </Card>
      { !isPresentStatus && <>
      <Card variant="" style={{ maxWidth: 650, padding: "0 5px", margin: "0 auto" }}>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  name="roomId"
                  label="Room ID"
                  placeholder="Room ID"
                  value={roomId}
                  onChange={onChange}
                  variant="standard"
                  disabled
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="passCode"
                  label="Kode Akses"
                  placeholder="Masukkan Kode Akses"
                  value={passCode}
                  onChange={onChange}
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                {isLoading ? (
                  <Button size="large" style={{ margin: "20px auto" }} variant="contained" disabled fullWidth><CircularProgress size={25} style={{ margin: "1px" }}/></Button>
                ) : (
                  <Button size="large" style={{ margin: "20px auto" }} type="submit" variant="contained" color="primary" fullWidth>Hadir</Button>
                )}
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      </> }
    </>
  )
}

export default PresenceForm