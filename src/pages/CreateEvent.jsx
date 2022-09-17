import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createEvent, reset } from '../features/event/eventSlice'
import { Button, Card, CardContent, Checkbox, CircularProgress, FormControlLabel, Grid, MenuItem, TextField, Typography } from '@mui/material'
import moment from 'moment/moment'
import BackHeader from '../components/BackHeader'

function CreateEvent() {
  const [formData, setFormData] = useState({
    name: '',
    passCode: '',
    startDay: moment().date(),
    startMonth: moment().month() + 1,
    startYear: moment().year(),
    startHour: moment().hour(),
    startMinute: 0,
    endDay: moment().date(),
    endMonth: moment().month() + 1,
    endYear: moment().year(),
    endHour: moment().hour() + 1,
    endMinute: 0,
    location: '',
  })
  const [classTypes, setClassTypes] = useState([]);
  const {
    name,
    passCode,
    startDay,
    startMonth,
    startYear,
    startHour,
    startMinute,
    endDay,
    endMonth,
    endYear,
    endHour,
    endMinute,
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
    const startYearStr = startYear.toString()
    const startMonthStr = startMonth.toString().length === 1 ? '0'+startMonth.toString() : startMonth.toString()
    const startDayStr = startDay.toString().length === 1 ? '0'+startDay.toString() : startDay.toString()
    const startHourStr = startHour.toString().length === 1 ? '0'+startHour.toString() : startHour.toString()
    const startMinuteStr = startMinute.toString().length === 1 ? '0'+startMinute.toString() : startMinute.toString()

    const endYearStr = endYear.toString()
    const endMonthStr = endMonth.toString().length === 1 ? '0'+endMonth.toString() : endMonth.toString()
    const endDayStr = endDay.toString().length === 1 ? '0'+endDay.toString() : endDay.toString()
    const endHourStr = endHour.toString().length === 1 ? '0'+endHour.toString() : endHour.toString()
    const endMinuteStr = endMinute.toString().length === 1 ? '0'+endMinute.toString() : endMinute.toString()

    const start = `${startYearStr}-${startMonthStr}-${startDayStr}T${startHourStr}:${startMinuteStr}`
    const end = `${endYearStr}-${endMonthStr}-${endDayStr}T${endHourStr}:${endMinuteStr}`

    const startDate = moment(start).subtract(7, 'hours').format()
    const endDate = moment(end).subtract(7, 'hours').format()
    const data = {
      name,
      passCode,
      classTypes,
      startDate,
      endDate,
      location
    }
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
                  <Grid xs={12} item>
                    <Typography pt={2}>Mulai Kegiatan</Typography>
                  </Grid>
                  <Grid xs={4} item>
                    <TextField
                      name="startDay"
                      placeholder="Tgl"
                      label="Tgl Dimulai"
                      value={startDay}
                      onChange={onChange}
                      variant="standard"
                      align="left"
                      select
                      fullWidth
                      required
                    >
                      {Array.from(Array(31)).map((_, i) => i + 1).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid xs={4} item>
                    <TextField
                      name="startMonth"
                      placeholder="Bulan"
                      label="Bulan"
                      value={startMonth}
                      onChange={onChange}
                      variant="standard"
                      align="left"
                      select
                      fullWidth
                      required
                    >
                      {Array.from(Array(12)).map((_, i) => i + 1).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid xs={4} item>
                    <TextField
                      name="startYear"
                      label="Tahun"
                      placeholder="Tahun"
                      value={startYear}
                      onChange={onChange}
                      type="number"
                      variant="standard"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={6} item>
                    <TextField
                      name="startHour"
                      label="Jam Mulai"
                      placeholder="Jam"
                      value={startHour}
                      onChange={onChange}
                      type="number"
                      variant="standard"
                      InputProps={{ inputProps: { min: 1, max: 24 } }}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={6} item>
                    <TextField
                      name="startMinute"
                      label="Menit"
                      placeholder="Menit"
                      value={startMinute}
                      onChange={onChange}
                      type="number"
                      variant="standard"
                      InputProps={{ inputProps: { min: 0, max: 59 } }}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={12} item>
                    <Typography pt={2}>Selesai Kegiatan</Typography>
                  </Grid>
                  <Grid xs={4} item>
                    <TextField
                      name="endDay"
                      placeholder="Tgl"
                      label="Tgl Selesai"
                      value={endDay}
                      onChange={onChange}
                      variant="standard"
                      align="left"
                      select
                      fullWidth
                      required
                    >
                      {Array.from(Array(31)).map((_, i) => i + 1).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid xs={4} item>
                    <TextField
                      name="endMonth"
                      placeholder="Bulan"
                      label="Bulan"
                      value={endMonth}
                      onChange={onChange}
                      variant="standard"
                      align="left"
                      select
                      fullWidth
                      required
                    >
                      {Array.from(Array(12)).map((_, i) => i + 1).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid xs={4} item>
                    <TextField
                      name="endYear"
                      label="Tahun"
                      placeholder="Tahun"
                      value={endYear}
                      onChange={onChange}
                      type="number"
                      variant="standard"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={6} item>
                    <TextField
                      name="endHour"
                      label="Jam Selesai"
                      placeholder="Jam"
                      value={endHour}
                      onChange={onChange}
                      type="number"
                      variant="standard"
                      InputProps={{ inputProps: { min: 1, max: 24 } }}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={6} item>
                    <TextField
                      name="endMinute"
                      label="Menit"
                      placeholder="Menit"
                      value={endMinute}
                      onChange={onChange}
                      type="number"
                      variant="standard"
                      InputProps={{ inputProps: { min: 0, max: 59 } }}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
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