import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import {
  createEvent,
  getLastEventByName,
  reset,
} from "../features/event/eventSlice"
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Autocomplete,
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
  const [mustUpdateMaterialFirst, setMustUpdateMaterialFirst] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.events
  )

  // nama kegiatan yang autofill-nya sudah dijalankan, supaya blur berulang
  // tidak menimpa perubahan yang dilakukan user setelahnya
  const autofilledName = useRef("")

  useEffect(() => {
    if (!user) navigate("/login")
    if (user?.role === "GENERUS") navigate("/user-completion")
    if (isError) toast.error(message)
    if (isSuccess) {
      toast.success("berhasil.")
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
      selectedGrades,
      mustUpdateMaterialFirst,
    }
    dispatch(createEvent(data))
  }

  const [selectedGroupGrades, setSelectedGroupGrades] = useState([])
  const [selectedGrades, setSelectedGrades] = useState([])

  const handleGroupGradesChange = (event, newValue) => {
    if (newValue.some((option) => option.title === "CUSTOM")) {
      setSelectedGroupGrades([{ title: "CUSTOM" }])
      setSelectedGrades([]) // Initialize selectedGrades as an empty array
      return
    }

    setSelectedGroupGrades(newValue)
    let combinedGrades = []
    if (newValue.find((option) => option.title === "Cabe Rawit")) {
      combinedGrades = [...combinedGrades, ...caberawit]
    }
    if (newValue.find((option) => option.title === "Pra Remaja")) {
      combinedGrades = [...combinedGrades, ...praremaja]
    }
    if (newValue.find((option) => option.title === "Remaja")) {
      combinedGrades = [...combinedGrades, ...remaja]
    }
    if (newValue.find((option) => option.title === "Pra Nikah")) {
      combinedGrades = [...combinedGrades, ...pranikah]
    }
    setSelectedGrades(combinedGrades)
  }

  const handleGradesChange = (event, newValue) => {
    if (selectedGrades.some((option) => option.title === "CUSTOM")) {
      newValue = newValue.filter((option) => option.title !== "CUSTOM")
    }

    if (newValue.some((option) => option.title === "CUSTOM")) {
      setSelectedGrades([{ title: "CUSTOM" }])
    } else {
      setSelectedGrades(newValue)
    }
  }

  const gradesGroup = [
    { title: "Cabe Rawit" },
    { title: "Pra Remaja" },
    { title: "Remaja" },
    { title: "Pra Nikah" },
    { title: "CUSTOM" },
  ]

  const caberawit = [
    { title: "PAUD/TK", grade: 0 },
    { title: "Cabe Rawit 1", grade: 1 },
    { title: "Cabe Rawit 2", grade: 2 },
    { title: "Cabe Rawit 3", grade: 3 },
    { title: "Cabe Rawit 4", grade: 4 },
    { title: "Cabe Rawit 5", grade: 5 },
    { title: "Cabe Rawit 6", grade: 6 },
  ]

  const praremaja = [
    { title: "Pra Remaja 1", grade: 7 },
    { title: "Pra Remaja 2", grade: 8 },
    { title: "Pra Remaja 3", grade: 9 },
  ]

  const remaja = [
    { title: "Remaja 1", grade: 10 },
    { title: "Remaja 2", grade: 11 },
    { title: "Remaja 3", grade: 12 },
  ]

  const pranikah = [
    { title: "Pra Nikah 1", grade: 13 },
    { title: "Pra Nikah 2", grade: 14 },
    { title: "Pra Nikah 3", grade: 15 },
    { title: "Pra Nikah 4", grade: 16 },
  ]

  const fillGrades = (grades) => {
    const gradeNumbers = (grades ?? []).map(Number)
    const gradesGroupOptions = [
      { title: "Cabe Rawit", options: caberawit },
      { title: "Pra Remaja", options: praremaja },
      { title: "Remaja", options: remaja },
      { title: "Pra Nikah", options: pranikah },
    ]

    const fullGroups = gradesGroupOptions.filter((group) =>
      group.options.every((option) => gradeNumbers.includes(option.grade))
    )
    const groupedGrades = fullGroups.flatMap((group) => group.options)

    // rombongan belajar hanya bisa dipilih ulang bila tidak ada kelas sisa
    if (gradeNumbers.length && groupedGrades.length === gradeNumbers.length) {
      setSelectedGroupGrades(fullGroups.map(({ title }) => ({ title })))
      setSelectedGrades(groupedGrades)
      return
    }

    const allGrades = [...caberawit, ...praremaja, ...remaja, ...pranikah]
    setSelectedGroupGrades(gradeNumbers.length ? [{ title: "CUSTOM" }] : [])
    setSelectedGrades(
      allGrades.filter((option) => gradeNumbers.includes(option.grade))
    )
  }

  // tanggal mengikuti hari ini, jam mengikuti kegiatan terakhir
  const fillDates = (lastStartDate, lastEndDate) => {
    const todayAt = (value) => {
      const time = moment(Number(value))
      if (!value || !time.isValid()) return null
      return moment().set({
        hour: time.hour(),
        minute: time.minute(),
        second: 0,
        millisecond: 0,
      })
    }

    const start = todayAt(lastStartDate)
    let end = todayAt(lastEndDate)
    if (!start || !end) return

    // kegiatan yang jam selesainya melewati tengah malam
    if (!end.isAfter(start)) end = end.add(1, "days")

    setStartTime(start)
    setEndTime(end)
  }

  const onNameBlur = async () => {
    const eventName = name.trim()
    if (!eventName) return
    if (eventName.toLowerCase() === autofilledName.current.toLowerCase()) return

    try {
      const { data } = await dispatch(getLastEventByName(eventName)).unwrap()
      if (!data) return

      autofilledName.current = eventName
      setFormData((prevState) => ({
        ...prevState,
        passcode: data.passcode ?? "",
        location: data.location ?? "",
        description: data.description ?? "",
      }))
      fillGrades(data.grades)
      fillDates(data.startDate, data.endDate)
      toast.info("Rencana kegiatan selesai diisikan oleh autofill, silakan periksa kembali.")
    } catch (error) {
      // autofill hanya pelengkap, kegagalannya tidak perlu mengganggu user
    }
  }

  return (
    <>
      <BackHeader title='Kegiatan' />

      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Buat Kegiatan
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
                      onBlur={onNameBlur}
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
                    <Autocomplete
                      multiple
                      options={gradesGroup}
                      getOptionLabel={(option) => option.title}
                      fullWidth
                      value={selectedGroupGrades}
                      onChange={handleGroupGradesChange}
                      isOptionEqualToValue={(option, value) =>
                        option.title === value.title
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name='groupGrades'
                          label='Rombongan Belajar'
                          placeholder={
                            selectedGroupGrades[0]?.title === "CUSTOM"
                              ? ""
                              : "Tambah Kelas"
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={
                        selectedGroupGrades[0]?.title === "CUSTOM"
                          ? [...caberawit, ...praremaja, ...remaja, ...pranikah]
                          : selectedGrades
                      }
                      getOptionLabel={(option) => option.title}
                      fullWidth
                      disableCloseOnSelect
                      value={selectedGrades}
                      onChange={handleGradesChange}
                      isOptionEqualToValue={(option, value) =>
                        option.title === value.title
                      }
                      disabled={selectedGroupGrades[0]?.title !== "CUSTOM"}
                      readOnly={selectedGroupGrades[0]?.title !== "CUSTOM"}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name='grades'
                          label='Kelas'
                          placeholder={
                            selectedGroupGrades[0]?.title === "CUSTOM"
                              ? "Tambah Kelas"
                              : ""
                          }
                        />
                      )}
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
                    <FormControl>
                      <FormLabel
                        id='must-update-material-first-label'
                        sx={{ fontSize: 14 }}
                      >
                        Generus wajib update capaian target sebelum konfirmasi
                        kehadiran?
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby='must-update-material-first-label'
                        name='mustUpdateMaterialFirst'
                        value={String(mustUpdateMaterialFirst)}
                        onChange={(e) =>
                          setMustUpdateMaterialFirst(e.target.value === 'true')
                        }
                      >
                        <FormControlLabel
                          value='true'
                          control={<Radio size='small' />}
                          label='Ya'
                        />
                        <FormControlLabel
                          value='false'
                          control={<Radio size='small' />}
                          label='Tidak'
                        />
                      </RadioGroup>
                    </FormControl>
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
