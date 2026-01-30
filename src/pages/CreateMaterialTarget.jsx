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
} from "@mui/material"
import BackHeader from "../components/BackHeader"

function CreateMaterialTarget() {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  return (
    <>
      <BackHeader title='Buat Target Materi' />
      <Container sx={{ mt: 3 }}>
        <Typography variant='h6' align='center' sx={{ mb: 3 }}>
          Buat Target Materi
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth size='small'>
              <InputLabel id='month-label'>Bulan</InputLabel>
              <Select
                labelId='month-label'
                id='month-select'
                value={month}
                label='Bulan'
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
              size='small'
              label='Tahun'
              type='number'
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default CreateMaterialTarget
