import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import {
  createPresence,
  isPresent,
  reset,
} from "../features/presences/presenceSlice"
import translate from "../utils/translate"
import CheckIcon from "@mui/icons-material/CheckCircleOutlineRounded"

function PresenceForm(props) {
  const { event, user } = props
  const [formData, setFormData] = useState({
    eventId: event.id,
    passcode: "",
  })
  const { eventId, passcode } = formData
  const dispatch = useDispatch()

  const {
    isLoading,
    isError,
    isSuccess,
    message,
    isPresentStatus,
    isLoadingPresentStatus,
    isSuccessPresentStatus,
  } = useSelector((state) => state.presences)

  useEffect(() => {
    if (isError) toast.error(message)
    if (isSuccess) toast.success("Isi kehadiran berhasil!")
    dispatch(isPresent({ eventId, userId: user.id }))
    dispatch(reset())
  }, [isError, isSuccess, message, dispatch, eventId, user.id])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const data = {
      eventId,
      passcode,
    }
    dispatch(createPresence(data))
  }

  const eventTime = () => {
    const time = isPresentStatus?.data.createdAt || event.startDate
    const startDateObject = moment(new Date(Number(time)))
    const startDate = startDateObject.format("DD MMM YYYY")
    const startTime = startDateObject.format("HH.mm")
    const startDayName = translate.days(startDateObject.format("dddd"))
    return `${startDayName}, ${startDate} pkl. ${startTime}`
  }

  if (isLoadingPresentStatus)
    return (
      <Grid align='center' sx={{ pt: 1.5 }}>
        <CircularProgress size={20} />
      </Grid>
    )

  return (
    <>
      <Card sx={{ mb: 0.5 }} align='center'>
        <CardContent
          sx={{
            padding: 2,
            "&:last-child": {
              paddingBottom: 2,
            },
          }}
        >
          <Typography variant='h5'>{event.name}</Typography>
          <Typography variant='body2'>{eventTime()}</Typography>
          {isPresentStatus && isSuccessPresentStatus && (
            <>
              <Typography pt={3} color='green'>
                <CheckIcon fontSize='large' />
              </Typography>
              <Typography variant='h5'>Hadir</Typography>
            </>
          )}
        </CardContent>
      </Card>
      {!isPresentStatus && (
        <>
          <Card
            variant=''
            style={{ maxWidth: 650, padding: "0 5px", margin: "0 auto" }}
          >
            <CardContent>
              <form onSubmit={onSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      name='passcode'
                      label='Kode Akses'
                      placeholder='Masukkan Kode Akses'
                      value={passcode}
                      onChange={onChange}
                      variant='standard'
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {isLoading ? (
                      <Button
                        size='large'
                        style={{ margin: "20px auto" }}
                        variant='contained'
                        disabled
                        fullWidth
                      >
                        <CircularProgress size={25} style={{ margin: "1px" }} />
                      </Button>
                    ) : (
                      <Button
                        size='large'
                        style={{ margin: "20px auto" }}
                        type='submit'
                        variant='contained'
                        color='primary'
                        fullWidth
                      >
                        Hadir
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </>
  )
}

export default PresenceForm
