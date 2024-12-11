import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { reset, updateTeacherProfile } from "../features/auth/authSlice"

import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material"

import BackHeader from "../components/BackHeader"
import moment from "moment"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import haditsOptions from "../constants/haditsOptions"
import scopeOptions from "../constants/scopeOptions"
import maritalStatusOptions from "../constants/maritalStatusOptions"

function EditKemuballighan() {
  const dispatch = useDispatch()
  const { user: session } = useSelector((state) => state.auth)
  const { isError, isSuccess, message } = useSelector((state) => state.auth)

  const user = session
  const initialFormData = {
    ...user,
    assignmentStartDate: user.assignmentStartDate
      ? moment.unix(user.assignmentStartDate)
      : moment(),
    assignmentFinishDate: user.assignmentFinishDate
      ? moment.unix(user.assignmentFinishDate)
      : moment(),
  }
  const [isFormChanged, setIsFormChanged] = useState(false)
  const [formData, setFormData] = useState(initialFormData)

  const {
    muballighStatus,
    pondok,
    kertosonoYear,
    firstDutyYear,
    timesDuties,
    education,
    maritalStatus,
    children,
    job,
    hasBpjs,
    greatHadiths,
    scopes,
    assignmentStartDate,
    assignmentFinishDate,
  } = formData

  useEffect(() => {
    if (isError) toast.error(message)
    if (isSuccess) toast.success("Update profile berhasil.")
    dispatch(reset())
  }, [dispatch, isError, isSuccess, message])

  const checkFormChange = (newFormData) => {
    const hasChanged = Object.keys(initialFormData).some(
      (key) => initialFormData[key] !== Number(newFormData[key])
    )
    setIsFormChanged(hasChanged)
  }

  const onChange = (e) => {
    setFormData((prevState) => {
      const updatedFormData = {
        ...prevState,
        [e.target.name]: e.target.value,
      }
      checkFormChange(updatedFormData)
      return updatedFormData
    })
  }

  const handleChangeHadits = (event) => {
    const { value } = event.target
    const newValue = typeof value === "string" ? value.split(",") : value
    setFormData((prevState) => {
      const updated = { ...prevState, greatHadiths: newValue }
      checkFormChange(updated)
      return updated
    })
  }

  const handleChangeScopes = (event) => {
    const { value } = event.target
    const newValue = typeof value === "string" ? value.split(",") : value
    setFormData((prevState) => {
      const updated = { ...prevState, scopes: newValue }
      checkFormChange(updated)
      return updated
    })
  }

  const handleStartTimeChange = (newValue) => {
    setFormData((prevState) => {
      const updated = { ...prevState, assignmentStartDate: newValue }
      checkFormChange(updated)
      return updated
    })
  }

  const handleFinishTimeChange = (newValue) => {
    setFormData((prevState) => {
      const updated = { ...prevState, assignmentFinishDate: newValue }
      checkFormChange(updated)
      return updated
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const userData = {
      muballighStatus,
      pondok,
      kertosonoYear,
      firstDutyYear,
      timesDuties,
      education,
      maritalStatus,
      children,
      job,
      hasBpjs,
      greatHadiths,
      scopes,
      assignmentStartDate: moment(assignmentStartDate).unix(),
      assignmentFinishDate: moment(assignmentFinishDate).unix(),
    }
    dispatch(updateTeacherProfile(userData))
    setIsFormChanged(false)
  }

  const userForms = () => (
    <>
      <Grid item xs={12}>
        <TextField
          name='muballighStatus'
          label='Status Kemuballighan'
          placeholder='Status'
          value={muballighStatus}
          onChange={onChange}
          variant='outlined'
          align='left'
          select
          fullWidth
          required
        >
          {[
            { value: "MT", label: "Tugasan" },
            { value: "MS", label: "Setempat" },
            { value: "MSS", label: "Sukarela" },
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Hatam Hadits Besar</InputLabel>
          <Select
            multiple
            value={greatHadiths}
            onChange={handleChangeHadits}
            input={<OutlinedInput label='Hatam Hadits Besar' />}
            renderValue={(selected) => {
              const selectedTypes = selected
                .map((id) => haditsOptions.find((o) => o.id === id)?.type)
                .filter(Boolean)
              return selectedTypes.join(", ")
            }}
          >
            {haditsOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                <Checkbox checked={greatHadiths?.includes(option.id)} />
                <ListItemText primary={option.type} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          name='pondok'
          label='Asal Pondok'
          placeholder='Asal Pondok'
          value={pondok}
          onChange={onChange}
          variant='outlined'
          fullWidth
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name='kertosonoYear'
          label='Tahun Lulus Tes Muballigh'
          placeholder='Tahun'
          value={kertosonoYear}
          onChange={onChange}
          variant='outlined'
          type='number'
          fullWidth
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name='firstDutyYear'
          label='Tahun Pertama Kali Tugasan'
          placeholder='Tahun'
          value={firstDutyYear}
          onChange={onChange}
          variant='outlined'
          type='number'
          fullWidth
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name='timesDuties'
          label='Jumlah Pengalaman Tugasan'
          placeholder='Jumlah'
          value={timesDuties}
          onChange={onChange}
          variant='outlined'
          type='number'
          fullWidth
          required
        />
      </Grid>
      {muballighStatus === "MT" ? (
        <>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                name='assignmentStartDate'
                label='Tahun Mulai Tugasan Saat ini'
                value={assignmentStartDate}
                onChange={handleStartTimeChange}
                views={["year", "month"]}
                inputFormat='MM/YYYY'
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                name='assignmentFinishDate'
                label='Tahun Selesai Tugasan Saat ini'
                value={assignmentFinishDate}
                onChange={handleFinishTimeChange}
                views={["year", "month"]}
                inputFormat='MM/YYYY'
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
        </>
      ) : (
        <></>
      )}

      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Cakupan Mengajar</InputLabel>
          <Select
            multiple
            value={scopes}
            onChange={handleChangeScopes}
            input={<OutlinedInput label='Cakupan Mengajar' />}
            renderValue={(selected) => {
              const selectedTypes = selected
                .map((id) => scopeOptions.find((o) => o.id === id)?.type)
                .filter(Boolean)
              return selectedTypes.join(", ")
            }}
          >
            {scopeOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                <Checkbox checked={scopes?.includes(option.id)} />
                <ListItemText primary={option.type} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          name='education'
          label='Pendidikan Terakhir'
          placeholder='Pendidikan'
          value={education}
          onChange={onChange}
          variant='outlined'
          align='left'
          select
          fullWidth
          required
        >
          {[
            { value: "SD", label: "SD" },
            { value: "SMP", label: "SMP" },
            { value: "SMA", label: "SMA" },
            { value: "SMK", label: "SMK" },
            { value: "D1", label: "D1" },
            { value: "D2", label: "D2" },
            { value: "D3", label: "D3" },
            { value: "D4", label: "D4" },
            { value: "S1", label: "S1" },
            { value: "S2", label: "S2" },
            { value: "S3", label: "S3" },
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          name='maritalStatus'
          label='Status Pernikahan'
          placeholder='Status'
          value={maritalStatus}
          onChange={onChange}
          variant='outlined'
          align='left'
          select
          fullWidth
          required
        >
          {maritalStatusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          name='children'
          label='Jumlah Anak'
          placeholder='Jumlah'
          value={children}
          onChange={onChange}
          variant='outlined'
          type='number'
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name='job'
          label='Maisyah Tambahan'
          placeholder='Maisyah Tambahan'
          value={job}
          onChange={onChange}
          variant='outlined'
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name='hasBpjs'
          label='Memiliki BPJS'
          placeholder='Status'
          value={hasBpjs}
          onChange={onChange}
          variant='outlined'
          align='left'
          select
          fullWidth
          required
        >
          {[
            { value: true, label: "Ya" },
            { value: false, label: "Tidak" },
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <Button
          size='large'
          style={{ margin: "20px auto" }}
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          disabled={!isFormChanged}
        >
          Ubah
        </Button>
      </Grid>
    </>
  )

  return (
    <>
      <BackHeader title='Profile' />
      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Kemuballighan
      </Typography>

      <Grid>
        <Card variant=''>
          <CardContent>
            <form onSubmit={onSubmit}>
              <Grid container spacing={2}>
                {userForms()}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default EditKemuballighan
