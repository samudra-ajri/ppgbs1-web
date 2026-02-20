import { useState, useEffect } from "react"
import {
  Typography,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import BackHeader from "../components/BackHeader"
import gradeEnum from "../enums/gradeEnum"
import {
  createMaterialTargets,
  reset,
} from "../features/materialTargets/materialTargetSlice"

function CreateMaterialTarget() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [grades, setGrades] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.materialTargets,
  )

  useEffect(() => {
    dispatch(reset())
  }, [dispatch])

  useEffect(() => {
    if (isSubmitted && isError) {
      toast.error(message)
      setIsSubmitted(false)
    }
    if (isSubmitted && isSuccess) {
      toast.success("berhasil menambahkan")
      navigate("/material-target")
      dispatch(reset())
    }
  }, [isSubmitted, isError, isSuccess, message, navigate, dispatch])

  const onSubmit = () => {
    setIsSubmitted(true)
    const data = {
      materialIds: null,
      grades: grades.map((grade) => parseInt(grade)),
      month: parseInt(month),
      year: parseInt(year),
    }
    dispatch(createMaterialTargets(data))
  }

  return (
    <>
      <BackHeader title='Buat Target Materi' />
      <Container sx={{ mt: 3 }}>
        <Typography variant='h6' align='center' sx={{ mb: 3 }}>
          Buat Target Materi
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth size='medium'>
              <InputLabel id='month-label'>Bulan</InputLabel>
              <Select
                labelId='month-label'
                id='month-select'
                value={month}
                label='Bulan'
                size='medium'
                onChange={(e) => setMonth(e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label='Tahun'
              type='number'
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={Object.entries(gradeEnum).map(([key, value]) => ({
                key,
                value,
              }))}
              getOptionLabel={(option) => option.value}
              fullWidth
              disableCloseOnSelect
              value={grades.map((key) => ({ key, value: gradeEnum[key] }))}
              onChange={(event, newValue) => {
                setGrades(newValue.map((item) => item.key))
              }}
              isOptionEqualToValue={(option, value) => option.key === value.key}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Rombongan Belajar'
                  placeholder='Tambah Kelas'
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={onSubmit}
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
      </Container>
    </>
  )
}

export default CreateMaterialTarget
