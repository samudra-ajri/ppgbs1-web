import React, { useEffect, useState } from "react"
import { Card, CardContent, Typography, Grid, Box } from "@mui/material"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"

import translate from "../utils/translate"
import {
  createPresence,
  deletePresence,
  getPresencesByEventId,
} from "../features/presences/presenceSlice"
import { toast } from "react-toastify"

// Format event date and time using Moment.js
const formatEventTime = (event) => {
  const start = moment(Number(event.startDate))
  const end = moment(Number(event.endDate))

  const startDate = start.format("DD/MM/YY")
  const startTime = start.format("HH.mm")
  const endDate = end.format("DD/MM/YY")
  const endTime = end.format("HH.mm")

  const startDayName = translate.days(start.format("dddd"))
  const endDayName = translate.days(end.format("dddd"))

  if (startDate === endDate) {
    return (
      <>
        {`${startDayName}, ${startDate}`}
        <br />
        {`Pkl. ${startTime} - ${endTime}`}
      </>
    )
  }

  return `${startDayName}, ${startDate} pkl. ${startTime} - ${endDayName}, ${endDate} pkl. ${endTime}`
}

// Component to render an event description that may be a clickable URL
const EventDescription = ({ description }) => (
  <Typography variant='body2' mt={2} sx={{ textDecoration: "underline" }}>
    {description.startsWith("https://") ? (
      <a
        href={description}
        target='_blank'
        rel='noopener noreferrer'
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {description}
      </a>
    ) : (
      description
    )}
  </Typography>
)

// Card component for the main event
const MainEventCard = ({ event }) => (
  <Card align='center' sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant='h5'>{event.name}</Typography>
      <Typography variant='body2'>{formatEventTime(event)}</Typography>
      {event.description && (
        <EventDescription description={event.description} />
      )}
    </CardContent>
  </Card>
)

// Card component for a group event
const GroupEventCard = ({ groupEvent, parentEvent, isAttended, onToggle }) => (
  <Card
    variant='outlined'
    sx={{
      cursor: "pointer",
      backgroundColor: isAttended ? "#2E7D32" : "#FFFFFF",
      color: isAttended ? "#F0F6F0" : "#212121",
    }}
    onClick={onToggle}
  >
    <CardContent sx={{ padding: 2, "&:last-child": { paddingBottom: 2 } }}>
      <Typography variant='body2'>
        <strong>{groupEvent.name.replace(parentEvent.name, "")}</strong>
      </Typography>
      <Typography sx={{ fontSize: "12px" }}>
        {formatEventTime(groupEvent)}
      </Typography>
    </CardContent>
  </Card>
)

// Grid component for displaying multiple group events
const GroupEventsGrid = ({
  groupEvents,
  parentEvent,
  attendedEventIds,
  onToggle,
}) => (
  <Grid container spacing={1}>
    {groupEvents.map((ge) => (
      <Grid item xs={6} sm={4} key={ge.id}>
        <GroupEventCard
          groupEvent={ge}
          parentEvent={parentEvent}
          isAttended={!!attendedEventIds[ge.id]}
          onToggle={() => onToggle(ge.id)}
        />
      </Grid>
    ))}
  </Grid>
)

// Main form component to manage event presence
const GroupPresenceForm = ({ event }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { attenders } = useSelector((state) => state.presences)
  const [attendedEventIds, setAttendedEventIds] = useState({})

  // Fetch presences when the component mounts or event/user changes
  useEffect(() => {
    dispatch(getPresencesByEventId({ eventId: event.id, userId: user.id }))
  }, [dispatch, event.id, user.id])

  // Update attended event IDs when attenders data changes
  useEffect(() => {
    console.log(123)

    const newAttendedEventIds = attenders.reduce((acc, { eventId }) => {
      acc[eventId] = true
      return acc
    }, {})
    setAttendedEventIds(newAttendedEventIds)
  }, [attenders])

  // Toggle attended state for a specific group event
  const handleToggleAttended = (id) => {
    setAttendedEventIds((prev) => {
      if (prev[id]) {
        const updated = { ...prev }
        delete updated[id]
        dispatch(deletePresence({ eventId: id }))
        return updated
      }
      dispatch(createPresence({ eventId: id }))
      toast.success("Isi kehadiran berhasil!")
      return { ...prev, [id]: true }
    })
  }

  return (
    <Box sx={{ pb: 20 }}>
      <MainEventCard event={event} />
      {event.groupEvents?.length > 0 && (
        <GroupEventsGrid
          groupEvents={event.groupEvents}
          parentEvent={event}
          attendedEventIds={attendedEventIds}
          onToggle={handleToggleAttended}
        />
      )}
    </Box>
  )
}

export default GroupPresenceForm
