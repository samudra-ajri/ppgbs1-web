import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import capitalize from "capitalize"
import moment from "moment"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import DeleteIcon from "@mui/icons-material/CloseOutlined"
import {
  createPresenceByAdmin,
  getPresencesByEventId,
  removeAttender,
  reset,
} from "../features/presences/presenceSlice"
import translate from "../utils/translate"
import {
  getUsersPaginate,
  reset as resetSearch,
} from "../features/users/userSlice"
import PopDialog from "./PopDialog"

function PresenceList(props) {
  const { event, user } = props
  const dispatch = useDispatch()
  const { users } = useSelector((state) => state.users)
  const [page, setPage] = useState(2)
  const [search, setSearch] = useState("-")
  const [searchValue, setSearchValue] = useState(null)
  const [openPopup, setOpenPopup] = useState(false)
  const [removeId, setRemoveId] = useState("")

  const {
    isError,
    message,
    attenders,
    attendersCount,
    isSuccess,
    isLoading,
    hasNextPage,
    isSuccessAttenders,
  } = useSelector((state) => state.presences)

  useEffect(() => {
    if (isError) toast.error(message)
    if (isSuccess) toast.success("behasil.")
  }, [isError, isSuccess, message])

  useEffect(() => {
    dispatch(getPresencesByEventId({ page: 1, eventId: event.id }))
    return () => {
      dispatch(reset())
    }
  }, [dispatch, event.id])

  const fetchMoreAttenders = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1)
      dispatch(getPresencesByEventId({ page: page, eventId: event.id }))
    }
  }

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (search) {
  //       dispatch(getUsersPaginate({ page: 1, search, role: "GENERUS" }))
  //       dispatch(resetSearch())
  //     } else {
  //       setSearch([])
  //     }
  //   }, 1000)

  //   return () => clearTimeout(timeoutId)
  // }, [dispatch, search])

  const eventTime = () => {
    const startDateObject = moment(new Date(Number(event.startDate)))
    const startDate = startDateObject.format("DD MMM YYYY")
    const startTime = startDateObject.format("HH.mm")
    const startDayName = translate.days(startDateObject.format("dddd"))
    return `${startDayName}, ${startDate} pkl. ${startTime}`
  }

  const presenceTime = (time) => {
    const createdDateObject = moment(new Date(Number(time)))
    const startTime = createdDateObject.format("HH:mm")
    const startDayName = translate.days(createdDateObject.format("dddd"))
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

  const onClickRemove = () => {
    const data = {
      eventId: event.id,
      userId: removeId,
    }
    dispatch(removeAttender(data))
    setOpenPopup(false)
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

      {/* <Grid container paddingBottom={5} paddingTop={5} spacing={2}>
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
                size='small'
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
            size='small'
            type='submit'
            variant='contained'
            color='info'
            fullWidth
            style={{ paddingTop: "9px", paddingBottom: "8px" }}
            onClick={onSubmit}
          >
            Tambah
          </Button>
        </Grid>
      </Grid> */}

      <InfiniteScroll
        dataLength={attenders?.length || 0}
        next={fetchMoreAttenders}
        hasMore={hasNextPage}
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
        {isSuccessAttenders &&
          attenders.map((attender) => (
            <Card key={attender.userId} sx={{ mb: 0.5 }} align='left'>
              <Grid container>
                <Grid item md={11} xs={10}>
                  <CardContent
                    sx={{ padding: 2, "&:last-child": { paddingBottom: 2 } }}
                  >
                    <Typography
                      fontSize={10}
                      component='p'
                      color='text.secondary'
                    >
                      {presenceTime(attender.createdAt)}
                    </Typography>
                    <Typography variant='body1'>{attender.userName}</Typography>
                    <Typography
                      fontSize={10}
                      component='p'
                      color='text.secondary'
                    >
                      {attender.organizationName}
                    </Typography>
                    <Typography
                      fontSize={10}
                      component='p'
                      color='text.secondary'
                    >
                      {attender.userSex === 1 ? "Laki-laki" : "Perempuan"}
                    </Typography>
                  </CardContent>
                </Grid>
                {attender.createdBy === user.id ? (
                  <Grid item>
                    <IconButton
                      align='right'
                      onClick={() => {
                        setOpenPopup(true)
                        setRemoveId(attender.userId)
                      }}
                    >
                      <DeleteIcon fontSize='medium' color='error' />
                    </IconButton>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
            </Card>
          ))}
      </InfiniteScroll>

      <PopDialog title={"Hapus kehadiran?"} openPopup={openPopup}>
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

export default PresenceList
