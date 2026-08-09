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
  const { event, validate, errorMessage, extraPayload, onPresenceCreated } =
    props
  const dispatch = useDispatch()
  const [passcode, setPasscode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isLoading, isPresentStatus, isLoadingPresentStatus } = useSelector(
    (state) => state.presences,
  )

  const isAlreadyPresent = isPresentStatus?.data.status === "HADIR"
  if (isLoadingPresentStatus || isAlreadyPresent) return null

  const onSubmit = async (e) => {
    e.preventDefault()
    if (validate && !validate()) return

    setIsSubmitting(true)
    try {
      // kehadiran dulu: kode akses yang salah ditolak di sini, sebelum apa pun disimpan
      await dispatch(
        createPresence({ eventId: event.id, passcode, ...extraPayload }),
      ).unwrap()
      if (onPresenceCreated) await onPresenceCreated()
    } catch (error) {
      // kegagalan kehadiran sudah dikabarkan lewat state presences
    } finally {
      setIsSubmitting(false)
    }
  }

  const isBusy = isLoading || isSubmitting

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
            disabled={isBusy}
            sx={{ minWidth: 120, height: 40 }}
          >
            {isBusy ? <CircularProgress size={20} /> : "Hadir"}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default PresenceCodeForm
