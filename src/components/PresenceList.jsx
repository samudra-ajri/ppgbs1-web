import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import capitalize from "capitalize"
import moment from "moment"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import {
  createPresenceByAdmin,
  getPresencesByRoomId,
  getPresencesByRoomIdPaginate,
  reset,
} from "../features/presences/presenceSlice"
import translate from "../utils/translate"
import {
  getUsersPaginate,
  reset as resetSearch,
} from "../features/users/userSlice"

function PresenceList(props) {
  const { event } = props
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { users } = useSelector((state) => state.users)
  const [page, setpage] = useState(2)
  const [search, setSearch] = useState("-")
  const [searchValue, setSearchValue] = useState(null)

  const { isError, message, attenders, attendersCount, isSuccess, isLoading } =
    useSelector((state) => state.presences)

  useEffect(() => {
    if (isError) toast.error(message)
    if (isSuccess) toast.success('behasil.')
    dispatch(getPresencesByRoomId({ page: 1, roomId: event.roomId }))
    dispatch(reset())
  }, [isError, message, event.roomId, navigate, dispatch, isSuccess])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search) {
        dispatch(getUsersPaginate({ page: 1, search, role: "GENERUS" }))
        dispatch(resetSearch())
      } else {
        setSearch([])
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [dispatch, search])

  const loadMoreUsers = () => {
    dispatch(getPresencesByRoomIdPaginate({ page, roomId: event.roomId }))
    setpage(page + 1)
  }

  const eventTime = () => {
    const startDate = moment(event.startDate).format("DD MMM YYYY")
    const startTime = moment(event.startDate).format("HH.mm")
    const startDayName = translate.days(moment(event.startDate).format("dddd"))
    return `${startDayName}, ${startDate} pkl. ${startTime}`
  }

  const presenceTime = (time) => {
    const startTime = moment(time).format("HH:mm")
    const startDayName = translate.days(moment(time).format("dddd"))
    return `${startDayName}, ${startTime}`
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setSearch("-")
    setSearchValue(null)
    const data = {
      roomId: event.roomId,
      userId: searchValue?._id,
    }
    dispatch(createPresenceByAdmin(data))
  }

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
          <Typography variant='h5' pt={2}>
            {attendersCount}
          </Typography>
          <Typography variant='body2'>Hadir</Typography>
        </CardContent>
      </Card>

      <Grid container paddingBottom={5} paddingTop={5} spacing={2}>
        <Grid item xs={8}>
          <Autocomplete
            clearOnBlur
            freeSolo
            disablePortal
            disableClearable
            id='combo-box-demo'
            fullWidth
            options={users}
            getOptionLabel={(user) => user.name} // Adjust this to match your API response
            value={searchValue}
            onChange={(event, newValue) => setSearchValue(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Tambah kehadiran generus...'
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value ? e.target.value : "-")
                }
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            disabled={isLoading}
            size='large'
            type='submit'
            variant='contained'
            color='info'
            fullWidth
            style={{ paddingTop: "14px", paddingBottom: "14px" }}
            onClick={onSubmit}
          >
            Tambah
          </Button>
        </Grid>
      </Grid>

      <InfiniteScroll
        dataLength={attenders.length}
        next={loadMoreUsers}
        hasMore={
          attenders.length % 20 !== 0 || attenders.length === 0 ? false : true
        }
        loader={
          <Grid align='center' sx={{ pt: 1.5 }}>
            <CircularProgress size={20} />
          </Grid>
        }
        endMessage={
          <Typography
            align='center'
            p={3}
            color='text.secondary'
            variant='body2'
          >
            {attenders.length === 0 && "Tidak ditemukan"}
          </Typography>
        }
      >
        {attenders.map((attender) => (
          <Card key={attender.user._id} sx={{ mb: 0.5 }} align='left'>
            <CardContent
              sx={{ padding: 2, "&:last-child": { paddingBottom: 2 } }}
            >
              <Typography fontSize={10} component='p' color='text.secondary'>
                {presenceTime(attender.time)}
              </Typography>
              <Typography variant='body1'>{attender.user.name}</Typography>
              <Typography fontSize={10} component='p' color='text.secondary'>
                {capitalize.words(`${attender.ds}, ${attender.klp}`)}
              </Typography>
              <Typography fontSize={10} component='p' color='text.secondary'>
                {attender.sex === "male" ? "Laki-laki" : "Perempuan"}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </InfiniteScroll>
    </>
  )
}

export default PresenceList
