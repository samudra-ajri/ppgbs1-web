import { Box, Button, Card, CardActionArea, CardContent, CircularProgress, Grid, IconButton, Stack, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded'
import capitalize from 'capitalize'
import moment from 'moment'
import { Link } from 'react-router-dom'
import translate from '../utils/translate'
import { useState } from 'react'
import PopDialog from './PopDialog'
import { deleteEvent } from '../features/listEvents/listEventsSlice'
import { useDispatch } from 'react-redux'

function EventCard(props) {
  const dispatch = useDispatch()
  const { event, user } = props
  const [openPopup, setOpenPopup] = useState(false)

  const region = () => {
    if (event.klp) return `PPK | ${capitalize.words(event.klp)}`
    if (!event.klp && event.ds) return `PPD | ${capitalize.words(event.ds)}`
    if (!event.klp && !event.ds) return 'PPG'
  }
  const canDelete = () => {
    if (event.klp && user.role === 'PPK') return true
    if ((!event.klp && event.ds) && user.role === 'PPD') return true
    if ((!event.klp && !event.ds) && user.role === 'PPG') return true
    return false
  }

  const onClick = () => {
    setOpenPopup(true)
  }

  const onClickRemove = () => {
    dispatch(deleteEvent(event._id))
  }

  const classTypesAttenders = {
    CR: 'Cabe Rawit',
    PR: 'Pra Remaja',
    RM: 'Remaja',
    PN: 'Pra Nikah'
  }

  const isLoading = false

  const eventTime = () => {
    const eventTime = {}
    const startDate = moment(event.startDate).format('DD/MM/YY')
    const startTime = moment(event.startDate).format('HH.mm')
    const endDate = moment(event.endDate).format('DD/MM/YY')
    const endTime = moment(event.endDate).format('HH.mm')
    const startDayName = translate.days(moment(event.startDate).format('dddd'))
    if (startDate === endDate) {
      eventTime.keys = <>
        <Typography variant='body2'>Hari</Typography>
        <Typography variant='body2'>Tanggal</Typography>
        <Typography variant='body2'>Jam</Typography>
      </>
      eventTime.values = <>
        <Typography variant='body2'>: {startDayName}</Typography>
        <Typography variant='body2'>: {startDate}</Typography>
        <Typography variant='body2'>: {startTime} - {endTime}</Typography>
      </>
    } else {
      eventTime.keys = <>
        <Typography variant='body2'>Hari</Typography>
        <Typography variant='body2'>Mulai</Typography>
        <Typography variant='body2'>Selesai</Typography>
      </>
      eventTime.values =  <>
        <Typography variant='body2'>: {startDayName}</Typography>
        <Typography variant='body2'>: {startDate} pkl. {startTime}</Typography>
        <Typography variant='body2'>: {endDate} pkl. {endTime}</Typography>
      </>
    }
    return eventTime
  }

  return (
    <>
      <Card sx={{ mb: 0.5, cursor: 'pointer' }}>
        <CardContent sx={{
          padding: 2,
          '&:last-child': {
            paddingBottom: 2
          }
        }}>
          <Grid container>
            <Grid item xs={10} md={11}>
              <Link to={user.role === 'GENERUS' ? `/c/event-presence/${event._id}` : `/c/event-details/${event._id}`} component={CardActionArea}>
                <Grid container>
                  <Grid item>
                    <Typography variant='h5'>
                      {event.name}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography pb={1} variant='subtitle2' color='text.secondary'>{region()}</Typography>

                <Grid container>
                  <Grid item xs={4}>
                    <Typography variant='body2'>Room ID</Typography>
                    { event.passCode && <Typography variant='body2'>Kode Akses</Typography>}
                    { eventTime().keys }
                    <Typography variant='body2'>Lokasi</Typography>
                    <Typography variant='body2'>Peserta</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant='body2'>: {event.roomIdSlug.split('-').join(' ')}</Typography>
                    { event.passCode && <Typography variant='body2'>: {event.passCode}</Typography>}
                    { eventTime().values }
                    <Typography variant='body2'>: {event.location}</Typography>
                    <Typography variant='body2'>: {event.classTypes.map(type => `${classTypesAttenders[type]} | `)}</Typography>
                  </Grid>
                </Grid>

              </Link>
            </Grid>
            {(user.role === 'GENERUS' && user.role === 'MT' && user.role === 'MS') && <Grid item>
                <IconButton align='right' disabled={!canDelete()} onClick={onClick}>
                  <DeleteIcon fontSize='medium' color={canDelete() ? 'error': 'inherit'} />
                </IconButton>
            </Grid>}
          </Grid>
        </CardContent>
      </Card>
      <PopDialog
        title={`Hapus ${event.name}?`}
        openPopup={openPopup}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', height: 45 }}>
          {isLoading ? (
            <Grid align="center" sx={{ pt: 1.5 }}>
              <CircularProgress size={20} />
            </Grid>
          ) : (
            <Stack spacing={1} direction='row'>
              <Button variant='outlined' color='error' onClick={onClickRemove}>Hapus</Button>
              <Button variant='contained' onClick={() => setOpenPopup(false)}>Batal</Button>
            </Stack>
          )}
        </Box>
      </PopDialog>
    </>
  )
}

export default EventCard