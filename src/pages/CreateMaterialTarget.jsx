import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material"
import moment from "moment"
import capitalize from "capitalize"
import {
  getGroupTargets,
  reset,
} from "../features/materialTargets/materialTargetSlice"
import gradeEnum from "../enums/gradeEnum"

function CreateMaterialTarget() {
  const dispatch = useDispatch()

  const { groupTargets, isLoading, isError, message } = useSelector(
    (state) => state.materialTargets,
  )

  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    dispatch(getGroupTargets({ month, year }))

    return () => {
      dispatch(reset())
    }
  }, [dispatch])

  const handleView = () => {
    dispatch(getGroupTargets({ month, year }))
  }

  return (
    <Container sx={{ mt: 3, mb: 10 }}>
      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Buat Target Materi
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }} alignItems='center'>
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            label='Bulan'
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            size='small'
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label='Tahun'
            type='number'
            value={year}
            onChange={(e) => setYear(e.target.value)}
            size='small'
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant='contained'
            fullWidth
            onClick={handleView}
            disabled={isLoading}
          >
            Lihat
          </Button>
        </Grid>
      </Grid>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color='error' align='center'>
          {message}
        </Typography>
      ) : (
        <Box>
          {groupTargets &&
            groupTargets.map((item, index) => {
              const gradesValue = typeof item === "object" ? item.grades : item
              const grades = gradesValue
                .map((grade) => gradeEnum[grade])
                .join(", ")

              return (
                <Card
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  key={item.id || item._id || index}
                >
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Grid
                      container
                      alignItems='center'
                      justifyContent='space-between'
                    >
                      <Grid item xs={12}>
                        <Typography variant='body2' color='textSecondary'>
                          Rombongan Belajar
                        </Typography>
                        <Typography variant='body1'>{grades}</Typography>
                        <Typography variant='body1' fontWeight='bold'>
                          Total {item.total} target
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )
            })}

          {(!groupTargets ||
            (Array.isArray(groupTargets) && groupTargets.length === 0)) && (
            <Typography align='center' sx={{ mt: 2 }}>
              Target belum dibuat.
            </Typography>
          )}
        </Box>
      )}
    </Container>
  )
}

export default CreateMaterialTarget
