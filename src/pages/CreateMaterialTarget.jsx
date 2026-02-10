import { useState } from "react"
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
} from "@mui/material"
import BackHeader from "../components/BackHeader"
import gradeEnum from "../enums/gradeEnum"

function CreateMaterialTarget() {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [grades, setGrades] = useState([])

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
        </Grid>
      </Container>
    </>
  )
}

export default CreateMaterialTarget
