import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createPresence } from "../features/presences/presenceSlice"

function PresenceCodeForm(props) {
  const { event, validate, errorMessage } = props
  const dispatch = useDispatch()
  const [passcode, setPasscode] = useState("")
  const { isLoading, isPresentStatus, isLoadingPresentStatus } = useSelector(
    (state) => state.presences,
  )

  const isAlreadyPresent = isPresentStatus?.data.status === "HADIR"
  if (isLoadingPresentStatus || isAlreadyPresent) return null

  const onSubmit = (e) => {
    e.preventDefault()
    if (validate && !validate()) return
    dispatch(createPresence({ eventId: event.id, passcode }))
  }

  return (
    <form onSubmit={onSubmit}>
      {errorMessage && (
        <Typography variant='body2' color='error' sx={{ mb: 1.5 }}>
          {errorMessage}
        </Typography>
      )}
      <Grid container spacing={1.5} alignItems='center'>
        <Grid item xs>
          <TextField
            name='passcode'
            label='Kode Akses'
            placeholder='Masukkan Kode Akses'
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            variant='outlined'
            size='small'
            fullWidth
            required
          />
        </Grid>
        <Grid item>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={isLoading}
            sx={{ minWidth: 120, height: 40 }}
          >
            {isLoading ? <CircularProgress size={20} /> : "Hadir"}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default PresenceCodeForm
