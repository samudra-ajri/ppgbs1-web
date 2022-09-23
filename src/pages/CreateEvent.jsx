import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { createEvent, reset } from '../features/event/eventSlice'
import { Button, Card, CardContent, Checkbox, CircularProgress, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import moment from 'moment/moment'
import BackHeader from '../components/BackHeader'

function CreateEvent() {
  const [startDate, setStartTime] = useState(moment())
  const handleStartTimeChange = (newValue) => { setStartTime(newValue) }

  const [endDate, setEndTime] = useState(moment().add(1, 'hours'))
  const handleEndTimeChange = (newValue) => { setEndTime(newValue) }


  const [formData, setFormData] = useState({
    name: '',
    passCode: '',
    location: ''
  })
  const [classTypes, setClassTypes] = useState([]);
  const {
    name,
    passCode,
    location
  } = formData
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.events
  )

  useEffect(() => {
    if (!user) navigate('/login')
    if (user?.role === 'GENERUS') navigate('/profile')
    if (isError) {
      toast.error(message)
    }
    if (isSuccess) {
      navigate('/events')
    }
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const onSelect = (e) => {
    let types = classTypes
    if (e.target.name === 'ALL') {
      setClassTypes(['CR', 'PR', 'RM', 'PN'])
    } else if (!types.includes(e.target.name)) {
      setClassTypes((prev => [...prev, e.target.name]))
    } else {
      setClassTypes(types.filter(type => type !== e.target.name))
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    // const startDate = moment(start).format()
    // const endDate = moment(end).format()
    const data = {
      name,
      passCode,
      classTypes,
      startDate: startDate.format(),
      endDate: endDate.format(),
      location
    }
    // console.log(data);
    dispatch(createEvent(data))
  }

  const classTypesAttenders = {
    CR: 'Cabe Rawit',
    PR: 'Pra Remaja',
    RM: 'Remaja',
    PN: 'Pra Nikah'
  }

  return (
    <>
      <BackHeader title='Kegiatan' />

      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Buat Jadwal</Typography>



      <Grid>
        <Card variant="" style={{ maxWidth: 650, padding: "0 5px", margin: "0 auto" }}>
          {isLoading ? (
            <Grid align="center" sx={{ pt: 5 }}>
              <CircularProgress />
            </Grid>
          ) : (
            <CardContent>
              <form onSubmit={onSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      name="name"
                      label="Nama Kegiatan"
                      placeholder="Nama"
                      value={name}
                      onChange={onChange}
                      variant="standard"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="passCode"
                      label="Kode Akses"
                      placeholder="Buat Kode Akses"
                      value={passCode}
                      onChange={onChange}
                      variant="standard"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="location"
                      label="Lokasi"
                      placeholder="Lokasi"
                      value={location}
                      onChange={onChange}
                      variant="standard"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} pb={2}>
                    <TextField
                      name="classTypes"
                      label="Peserta *"
                      value={classTypes}
                      variant="standard"
                      align="left"
                      fullWidth
                      disabled
                    />
                    {Object.keys(classTypesAttenders).map(type => (
                      <FormControlLabel
                        key={type}
                        control={
                          <Checkbox
                            name={type}
                            checked={classTypes.includes(type)}
                            onChange={onSelect}
                          />
                        }
                        label={classTypesAttenders[type]}
                      />
                    ))}
                  </Grid>
                  <Grid item xs={12} p={3}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DateTimePicker
                        name='startDate'
                        label='Waktu Mulai'
                        value={startDate}
                        onChange={handleStartTimeChange}
                        renderInput={(params) => <TextField {...params} />}
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
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  

                  <Grid item xs={12}>
                    <Button size="large" style={{ margin: "20px auto" }} type="submit" variant="contained" color="primary" fullWidth>Tambah</Button>
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