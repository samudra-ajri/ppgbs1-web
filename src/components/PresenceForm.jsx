import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material"
import moment from "moment"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { isPresent, reset } from "../features/presences/presenceSlice"
import translate from "../utils/translate"
import CheckIcon from "@mui/icons-material/CheckCircleOutlineRounded"

function PresenceForm(props) {
  const { event, user } = props
  const eventId = event.id
  const dispatch = useDispatch()

  const {
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

  const eventTime = () => {
    const startDateObject = moment(new Date(Number(event.startDate)))
    const endDateObject = moment(new Date(Number(event.endDate)))
    const startDate = startDateObject.format("DD/MM/YY")
    const startTime = startDateObject.format("HH.mm")
    const endDate = endDateObject.format("DD/MM/YY")
    const endTime = endDateObject.format("HH.mm")
    const startDayName = translate.days(startDateObject.format("dddd"))
    const startEndName = translate.days(endDateObject.format("dddd"))
    if (startDate === endDate) return `${startDayName}, ${startDate} pkl. ${startTime} - ${endTime}`
    return `${startDayName}, ${startDate} pkl. ${startTime} - ${startEndName}, ${endDate} pkl. ${endTime}`
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
          {event.description && <Typography mt={2} variant='body2'>{event.description}</Typography>}
          {isPresentStatus?.data.status === "HADIR" &&
            isSuccessPresentStatus && (
              <>
                <Typography pt={3} color='green'>
                  <CheckIcon fontSize='large' />
                </Typography>
                <Typography variant='h5'>Hadir</Typography>
              </>
            )}
        </CardContent>
      </Card>
    </>
  )
}

export default PresenceForm
