import { Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material'
import capitalize from 'capitalize'
import moment from 'moment'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getPresencesByRoomId, getPresencesByRoomIdPaginate, reset } from '../features/presences/presenceSlice'
import translate from '../utils/translate'

function PresenceList(props) {
  const { event } = props
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [page, setpage] = useState(2)

  const { isError, message, attenders, attendersCount } = useSelector(
    (state) => state.presences
  )

  useEffect(() => {
    if (isError) toast.error(message)
    dispatch(getPresencesByRoomId({page: 1, roomId: event.roomId}))
    dispatch(reset())
  }, [isError, message, event.roomId, navigate, dispatch])

  const loadMoreUsers = () => {
    dispatch(getPresencesByRoomIdPaginate({ page, roomId: event.roomId }))
    setpage(page + 1)
  }

  const eventTime = () => {
    const startDate = moment(event.startDate).format('DD MMM YYYY')
    const startTime = moment(event.startDate).format('HH.mm')
    const startDayName = translate.days(moment(event.startDate).format('dddd'))
    return `${startDayName}, ${startDate} pkl. ${startTime}`
  }

  const presenceTime = (time) => {
    const startTime = moment(time).format('HH:mm')
    const startDayName = translate.days(moment(time).format('dddd'))
    return `${startDayName}, ${startTime}`
  }

  return (
    <>
      <Card sx={{ mb: 0.5 }} align='center'>
        <CardContent sx={{
          padding: 2,
          '&:last-child': {
            paddingBottom: 2
          }
        }}>
          <Typography variant='h5'>{event.name}</Typography>
          <Typography variant='body2'>{eventTime()}</Typography>
          <Typography variant='h5' pt={2}>{attendersCount}</Typography>
          <Typography variant='body2'>Hadir</Typography>
        </CardContent>
      </Card>

      <InfiniteScroll
        dataLength={attenders.length}
        next={loadMoreUsers}
        hasMore={(attenders.length%20 !== 0 || attenders.length === 0) ? false : true}
        loader={
          <Grid align='center' sx={{ pt: 1.5 }}>
            <CircularProgress size={20} />
          </Grid>
        }
        endMessage={
          <Typography align='center' p={3} color='text.secondary' variant='body2'>
            {attenders.length === 0 && 'Tidak ditemukan'}
          </Typography>
        }
      >
        { attenders.map(attender => 
          <Card key={attender.user._id} sx={{ mb: 0.5 }} align='left'>
            <CardContent sx={{ padding: 2, '&:last-child': { paddingBottom: 2 }}}>
              <Typography fontSize={10} component='p' color='text.secondary'>{presenceTime(attender.time)}</Typography>
              <Typography variant='body1'>{attender.user.name}</Typography>
              <Typography fontSize={10} component='p' color='text.secondary'>{capitalize.words(`${attender.ds}, ${attender.klp}`)}</Typography>
              <Typography fontSize={10} component='p' color='text.secondary'>{(attender.sex === 'male' ? 'Laki-laki' : 'Perempuan')}</Typography>
            </CardContent>
          </Card>
        )}
      </InfiniteScroll>
    </>
  )
}

export default PresenceList