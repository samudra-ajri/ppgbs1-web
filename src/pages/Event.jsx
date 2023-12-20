import { Button, CircularProgress, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import EventCard from "../components/EventCard"
import { listEvents, reset } from "../features/listEvents/listEventsSlice"
import InfiniteScroll from "react-infinite-scroll-component"

function Event() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { events, hasNextPage, isSuccess } = useSelector(
    (state) => state.listEvents
  )
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!user) navigate("/login")
    dispatch(listEvents({ page: 1 }))
    return () => {
      dispatch(reset())
    }
  }, [user, navigate, dispatch])

  const fetchMoreEvents = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1)
      dispatch(listEvents({ page: page + 1 }))
    }
  }

  const onClick = () => {
    navigate("/c/create-event")
  }

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>
        Jadwal Kegiatan
      </Typography>
      
      {!isSuccess && (
        <Grid align='center' sx={{ pt: 1.5 }}>
          <CircularProgress size={20} />
        </Grid>
      )}

      {user.currentPosition.type === "ADMIN" && (
        <Button
          size='medium'
          style={{ margin: "20px auto" }}
          type='submit'
          variant='contained'
          color='info'
          fullWidth
          onClick={onClick}
        >
          Tambah
        </Button>
      )}
      <InfiniteScroll
        dataLength={events?.length || 0}
        next={fetchMoreEvents}
        hasMore={hasNextPage}
        loader={
          <Grid align='center' sx={{ pt: 1.5 }}>
            <CircularProgress size={20} />
          </Grid>
        }
      >
        {isSuccess &&
          events.map((event) => (
            <EventCard key={event.id} event={event} user={user} />
          ))}
      </InfiniteScroll>

      {isSuccess && events.length === 0 && (
        <Typography
          textAlign='center'
          pt={3}
          color='text.secondary'
          variant='body2'
        >
          Belum ada kegiatan.
        </Typography>
      )}
    </>
  )
}

export default Event
