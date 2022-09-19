import { Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material'
import capitalize from 'capitalize'
import moment from 'moment'
import { Link } from 'react-router-dom'

function EventCard(props) {
  const { event, user } = props
  const region = () => {
    if (event.klp) return `PPK | ${capitalize.words(event.klp)}`
    if (!event.klp && event.ds) return `PPD | ${capitalize.words(event.ds)}`
    if (!event.klp && !event.ds) return 'PPG'
  }

  console.log(user?.role);

  const classTypesAttenders = {
    CR: 'Cabe Rawit',
    PR: 'Pra Remaja',
    RM: 'Remaja',
    PN: 'Pra Nikah'
  }

  const eventTime = () => {
    const eventTime = {}
    const startDate = moment(event.startDate).format('DD MMM YYYY')
    const startTime = moment(event.startDate).format('HH.mm')
    const endDate = moment(event.endDate).format('DD MMM YYYY')
    const endTime = moment(event.endDate).format('HH.mm')
    if (startDate === endDate) {
      eventTime.keys = <>
        <Typography variant='body2'>Tanggal</Typography>
        <Typography variant='body2'>Jam</Typography>
      </>
      eventTime.values = <>
        <Typography variant='body2'>: {startDate}</Typography>
        <Typography variant='body2'>: {startTime} - {endTime}</Typography>
      </>
    } else {
      eventTime.keys = <>
        <Typography variant='body2'>Mulai</Typography>
        <Typography variant='body2'>Selesai</Typography>
      </>
      eventTime.values =  <>
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
              <Link to={user.role === 'GENERUS' ? `/c/event-presence/${event.roomId}` : `/c/event-details/${event._id}`} component={CardActionArea}>
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
                    { event.passCode && <Typography variant='body2'>Pass Code</Typography>}
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
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default EventCard