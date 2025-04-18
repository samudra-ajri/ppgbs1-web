import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/DeleteOutlineRounded"
import LayersIcon from "@mui/icons-material/LayersRounded"
import moment from "moment"
import { Link } from "react-router-dom"
import translate from "../utils/translate"
import { useState } from "react"
import PopDialog from "./PopDialog"
import { deleteEvent } from "../features/listEvents/listEventsSlice"
import { useDispatch } from "react-redux"

function EventCard(props) {
  const dispatch = useDispatch()
  const { event, user } = props
  const [openPopup, setOpenPopup] = useState(false)

  const canDelete = () => {
    if (Number(event.organizationId) === user.currentPosition.organizationId)
      return true
    return false
  }

  const onClick = () => {
    setOpenPopup(true)
  }

  const onClickRemove = () => {
    setOpenPopup(false)
    dispatch(deleteEvent(event.id))
  }

  const isLoading = false

  const eventTime = () => {
    const eventTime = {}
    const startDateObject = moment(new Date(Number(event.startDate)))
    const endDateObject = moment(new Date(Number(event.endDate)))
    const startDate = startDateObject.format("DD/MM/YY")
    const startTime = startDateObject.format("HH.mm")
    const endDate = endDateObject.format("DD/MM/YY")
    const endTime = endDateObject.format("HH.mm")
    const startDayName = translate.days(startDateObject.format("dddd"))
    const startEndName = translate.days(endDateObject.format("dddd"))
    if (startDate === endDate) {
      eventTime.keys = (
        <>
          <Typography sx={{ fontSize: "12px" }}>Hari</Typography>
          <Typography sx={{ fontSize: "12px" }}>Tanggal</Typography>
          <Typography sx={{ fontSize: "12px" }}>Jam</Typography>
        </>
      )
      eventTime.values = (
        <>
          <Typography sx={{ fontSize: "12px" }}>: {startDayName}</Typography>
          <Typography sx={{ fontSize: "12px" }}>: {startDate}</Typography>
          <Typography sx={{ fontSize: "12px" }}>
            : {startTime} - {endTime}
          </Typography>
        </>
      )
    } else {
      eventTime.keys = (
        <>
          <Typography sx={{ fontSize: "12px" }}>Mulai</Typography>
          <Typography sx={{ fontSize: "12px" }}>Selesai</Typography>
        </>
      )
      eventTime.values = (
        <>
          <Typography sx={{ fontSize: "12px" }}>
            : {startDayName}, {startDate} pkl. {startTime}
          </Typography>
          <Typography sx={{ fontSize: "12px" }}>
            : {startEndName}, {endDate} pkl. {endTime}
          </Typography>
        </>
      )
    }
    return eventTime
  }

  return (
    <>
      <Card variant='outlined' sx={{ mb: 0.5, cursor: "pointer" }}>
        <CardContent
          sx={{
            padding: 2,
            "&:last-child": {
              paddingBottom: 2,
            },
          }}
        >
          <Grid container>
            <Grid item xs={10} md={11}>
              <Link
                to={
                  user.currentPosition.type === "GENERUS"
                    ? event.isGroupHead
                      ? `/c/event-group-presence/${event.id}`
                      : `/c/event-presence/${event.id}`
                    : `/c/event-details/${event.id}`
                }
                component={CardActionArea}
              >
                <Grid container alignItems='center'>
                  {event.isGroupHead && (
                    <Grid item>
                      <LayersIcon
                        fontSize='small'
                        sx={{ mr: 1, opacity: 0.3 }}
                      />
                    </Grid>
                  )}
                  <Grid item>
                    <Typography variant='body2'>
                      <b>{event.name}</b>
                    </Typography>
                  </Grid>
                </Grid>
                <Typography
                  pb={1}
                  sx={{ fontSize: "10px" }}
                  color='text.secondary'
                >
                  {event.organizationName}
                </Typography>

                <Grid container>
                  <Grid item xs={4}>
                    {event.roomId && (
                      <Typography sx={{ fontSize: "12px" }}>Room ID</Typography>
                    )}
                    {event.passcode && (
                      <Typography sx={{ fontSize: "12px" }}>
                        Kode Akses
                      </Typography>
                    )}
                    {eventTime().keys}
                    <Typography sx={{ fontSize: "12px" }}>Lokasi</Typography>
                    {event.description && (
                      <Typography sx={{ fontSize: "12px" }}>
                        Keterangan
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={8}>
                    {event.roomId && (
                      <Typography sx={{ fontSize: "12px" }}>
                        : {event.roomId}
                      </Typography>
                    )}
                    {event.passcode && (
                      <Typography sx={{ fontSize: "12px" }}>
                        : {event.passcode}
                      </Typography>
                    )}
                    {eventTime().values}
                    <Typography sx={{ fontSize: "12px" }}>
                      : {event.location}
                    </Typography>
                    {event.description && (
                      <Typography sx={{ fontSize: "12px" }}>
                        : {event.description}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Link>
            </Grid>
            {user.currentPosition.type === "ADMIN" && (
              <Grid item>
                <IconButton
                  align='right'
                  disabled={!canDelete()}
                  onClick={onClick}
                >
                  <DeleteIcon
                    fontSize='medium'
                    color={canDelete() ? "error" : "inherit"}
                  />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
      <PopDialog title={`Hapus ${event.name}?`} openPopup={openPopup}>
        <Box sx={{ display: "flex", justifyContent: "center", height: 45 }}>
          {isLoading ? (
            <Grid align='center' sx={{ pt: 1.5 }}>
              <CircularProgress size={20} />
            </Grid>
          ) : (
            <Stack spacing={1} direction='row'>
              <Button variant='outlined' color='error' onClick={onClickRemove}>
                Hapus
              </Button>
              <Button variant='contained' onClick={() => setOpenPopup(false)}>
                Batal
              </Button>
            </Stack>
          )}
        </Box>
      </PopDialog>
    </>
  )
}

export default EventCard
