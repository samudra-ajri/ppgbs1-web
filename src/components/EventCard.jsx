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
    const timeData = []
    const startDateObject = moment(new Date(Number(event.startDate)))
    const endDateObject = moment(new Date(Number(event.endDate)))
    const startDate = startDateObject.format("DD/MM/YY")
    const startTime = startDateObject.format("HH.mm")
    const endDate = endDateObject.format("DD/MM/YY")
    const endTime = endDateObject.format("HH.mm")
    const startDayName = translate.days(startDateObject.format("dddd"))
    const startEndName = translate.days(endDateObject.format("dddd"))

    if (startDate === endDate) {
      timeData.push({ label: "Hari", value: startDayName })
      timeData.push({ label: "Tanggal", value: startDate })
      timeData.push({ label: "Jam", value: `${startTime} - ${endTime}` })
    } else {
      timeData.push({
        label: "Mulai",
        value: `${startDayName}, ${startDate} pkl. ${startTime}`,
      })
      timeData.push({
        label: "Selesai",
        value: `${startEndName}, ${endDate} pkl. ${endTime}`,
      })
    }
    return timeData
  }

  const detailRows = []
  if (event.roomId) detailRows.push({ label: "Room ID", value: event.roomId })
  if (event.passcode)
    detailRows.push({ label: "Kode Akses", value: event.passcode })

  detailRows.push(...eventTime())

  detailRows.push({ label: "Lokasi", value: event.location })
  if (event.description)
    detailRows.push({ label: "Keterangan", value: event.description })

  return (
    <>
      <Card
        variant='outlined'
        sx={{
          mb: 1.5,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardActionArea
          component={Link}
          to={
            user.currentPosition.type === "GENERUS"
              ? event.isGroupHead
                ? `/c/event-group-presence/${event.id}`
                : `/c/event-presence/${event.id}`
              : `/c/event-details/${event.id}`
          }
          sx={{ display: "block" }}
        >
          <CardContent
            sx={{ padding: 2.5, "&:last-child": { paddingBottom: 2.5 } }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box sx={{ flex: 1, pr: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  {event.isGroupHead && (
                    <LayersIcon
                      color='primary'
                      fontSize='small'
                      sx={{ mr: 1 }}
                    />
                  )}
                  <Typography
                    variant='subtitle1'
                    fontWeight='bold'
                    lineHeight={1.3}
                  >
                    {event.name}
                  </Typography>
                </Box>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontWeight: 500,
                  }}
                >
                  {event.organizationName}
                </Typography>
              </Box>

              {user.currentPosition.type === "ADMIN" && (
                <IconButton
                  size='small'
                  disabled={!canDelete()}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onClick()
                  }}
                  sx={{
                    mt: -0.5,
                    mr: -0.5,
                    color: canDelete() ? "error.main" : "action.disabled",
                    "&:hover": { backgroundColor: "error.lighter" },
                  }}
                >
                  <DeleteIcon fontSize='small' />
                </IconButton>
              )}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {detailRows.map((row, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "flex-start" }}
                >
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ width: 90, flexShrink: 0 }}
                  >
                    {row.label}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ px: 1 }}
                  >
                    :
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.primary'
                    sx={{ flex: 1, wordBreak: "break-word" }}
                  >
                    {row.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </CardActionArea>
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
