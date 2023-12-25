import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { createEvent, reset } from "../features/event/eventSlice"
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import moment from "moment/moment"
import BackHeader from "../components/BackHeader"

function CreateEvent() {
  const [startDate, setStartTime] = useState(moment())
  const handleStartTimeChange = (newValue) => {
    setStartTime(newValue)
  }

  const [endDate, setEndTime] = useState(moment().add(1, "hours"))
  const handleEndTimeChange = (newValue) => {
    setEndTime(newValue)
  }

  const [formData, setFormData] = useState({
    name: "",
    passcode: "",
    location: "",
    description: "",
  })

  const { name, passcode, location, description } = formData
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.events
  )

  useEffect(() => {
    if (!user) navigate("/login")
    if (user?.role === "GENERUS") navigate("/user-completion")
    if (isError) {
      toast.error(message)
    }
    if (isSuccess) {
      navigate("/events")
    }
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const data = {
      name,
      passcode,
      startDate: startDate.valueOf(),
      endDate: endDate.valueOf(),
      location,
      description,
    }
    dispatch(createEvent(data))
  }

  return (
    <>
      <BackHeader title='Kegiatan' />

      <Typography variant='h6' align='center' sx={{ mb: 1 }}>
        Buat Jadwal
      </Typography>

      <Grid>
        <Card
          variant=''
          style={{ maxWidth: 650, padding: "0 5px", margin: "0 auto" }}
        >
          {isLoading ? (
            <Grid align='center' sx={{ pt: 5 }}>
              <CircularProgress />
            </Grid>
          ) : (
            <CardContent>
              <form onSubmit={onSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name='name'
                      label='Nama Kegiatan'
                      placeholder='Nama'
                      value={name}
                      onChange={onChange}
                      variant='outlined'
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='passcode'
                      label='Kode Akses'
                      placeholder='Buat Kode Akses'
                      value={passcode}
                      onChange={onChange}
                      variant='outlined'
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='location'
                      label='Lokasi'
                      placeholder='Lokasi'
                      value={location}
                      onChange={onChange}
                      variant='outlined'
                      fullWidth
                      required
                      multiline
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DateTimePicker
                        name='startDate'
                        label='Waktu Mulai'
                        value={startDate}
                        onChange={handleStartTimeChange}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                        inputFormat='DD/MM/YYYY HH:mm'
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DateTimePicker
                        name='endDate'
                        label='Waktu Selesai'
                        value={endDate}
                        onChange={handleEndTimeChange}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                        inputFormat='DD/MM/YYYY HH:mm'
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name='description'
                      label='Keterangan'
                      placeholder='Keterangan'
                      value={description}
                      onChange={onChange}
                      variant='outlined'
                      fullWidth
                      multiline
                      rows={4}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      size='large'
                      style={{ margin: "20px auto" }}
                      type='submit'
                      variant='contained'
                      color='primary'
                      fullWidth
                    >
                      Tambah
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          )}
        </Card>
      </Grid>
    </>
  )
}

export default CreateEvent
