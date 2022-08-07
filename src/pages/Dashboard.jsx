import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Card, Chip, Grid, Typography } from '@mui/material'
import { getDashboard } from '../features/Dashboards/dashboardSlice'
import { useState } from 'react'
import { getLocations } from '../features/locations/locationSlice'
import translate from '../helpers/translateHelper'

function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { dashboardData } = useSelector(state => state.dashboard)
  const { locations } = useSelector((state) => state.locations)
  const [filters, setFilters] = useState({})
  const [focusDs, setFocusDs] = useState(user?.role === 'PPG' || user?.role === 'ADMIN' ? 'SEMUA DS' : user?.ds)
  const [focusKlp, setFocusKlp] = useState(user?.role === 'PPG' || user?.role === 'ADMIN' || user?.role === 'PPD' ? 'SEMUA KLP' : user?.klp)

  useEffect(() => {
    if (!user) navigate('/login')
    if (user?.role === 'GENERUS') navigate('/profile')
    dispatch(getLocations())
    dispatch(getDashboard(filters))
  }, [user, filters, navigate, dispatch])

  const dsList = () => {
    const ds = []
    const locationsList = locations?.locations ?? []
    locationsList.forEach(location => {
      ds.push(location.ds)
    })
    return ds
  }

  const klpList = () => {
    const locationsObj = locations?.locations ?? []
    return (locationsObj.find(o => o.ds === focusDs))?.klp ?? []
  }

  const onClickDs = (e) => {
    delete filters.klp
    if (e.target.innerText === 'SEMUA DS') {
      delete filters.ds
    } else {
      setFilters((prevState) => ({
        ...prevState,
        ds: e.target.innerText
      }))
    }
    dispatch(getDashboard(filters))
    setFocusDs(e.target.innerText)
    setFocusKlp('SEMUA KLP')
  }

  const onClickKlp = (e) => {
    if (e.target.innerText === 'SEMUA KLP') {
      delete filters.klp
    } else {
      setFilters((prevState) => ({
        ...prevState,
        klp: e.target.innerText
      }))
    }
    dispatch(getDashboard(filters))
    setFocusKlp(e.target.innerText)
  }

  const handleClick = (e, props) => {
    setFilters((prevState) => ({
      ...prevState,
      ...props
    }))
  }

  const handleClickRemove = (e, props) => {
    delete filters[props]
    dispatch(getDashboard(filters))
  }

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Dashboard</Typography>

      {(user.role === 'ADMIN' || user.role === 'PPG') &&
        <Box pb={1}>
          <Typography variant='body2'>Filter Ds</Typography>
          <Chip
            variant={'SEMUA DS' === focusDs ? 'solid' : 'outlined'}
            label={<Typography sx={{ fontSize: 10 }}> SEMUA DS </Typography>}
            name='SEMUA DS'
            color='info'
            sx={{ m: 0.25 }}
            onClick={onClickDs}
          />
          {dsList().map(ds => <Chip
            variant={ds === focusDs ? 'solid' : 'outlined'}
            key={ds}
            label={<Typography sx={{ fontSize: 10 }}> {ds} </Typography>}
            name={ds}
            color='info'
            sx={{ m: 0.25 }}
            onClick={onClickDs}
          />)}
        </Box>
      }
      {((user.role === 'ADMIN' || user.role === 'PPG' || user.role === 'PPD') && focusDs !== 'SEMUA DS') &&
        <Box pb={1}>
          <Typography variant='body2'>Filter Klp</Typography>
          <Chip
            variant={'SEMUA KLP' === focusKlp ? 'solid' : 'outlined'}
            label={<Typography sx={{ fontSize: 10 }}> SEMUA KLP </Typography>}
            name='SEMUA KLP'
            color='info'
            sx={{ m: 0.25 }}
            onClick={onClickKlp}
          />
          {klpList().map(klp => <Chip
            variant={klp === focusKlp ? 'solid' : 'outlined'}
            key={klp}
            label={<Typography sx={{ fontSize: 10 }}> {klp} </Typography>}
            color='info'
            name={klp}
            sx={{ m: 0.25 }}
            onClick={onClickKlp}
          />)}
        </Box>
      }

      <Box pb={1}>
        {Object.keys(filters).map(filter => (
          (filter !== 'ds' && filter !== 'klp') &&
          <Chip
            key={filter}
            variant='solid'
            label={<Typography sx={{ fontSize: 10 }}>{translate(filters[filter].toLowerCase())}</Typography>}
            sx={{ m: 0.25 }}
            onClick={e => { handleClickRemove(e, filter) }}
          />
        ))}
      </Box>

      <Grid container align='center' spacing={1}>
        <Grid item xs={6}>
          <Card onClick={e => { handleClick(e, { role: 'GENERUS' }) }} sx={{ padding: 1, justifyItems: 'center' }}>
            <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
              <Typography
                align='center'
                variant="h5"
                color="text.secondary"
              >{dashboardData?.users?.generus || 0}
              </Typography>
              <Typography
                align='center'
                variant="body2"
                color="text.secondary">Generus
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card onClick={e => { handleClick(e, { role: 'TEACHER' }) }} sx={{ padding: 1, justifyItems: 'center' }}>
            <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
              <Typography
                align='center'
                variant="h5"
                color="text.secondary"
              >{dashboardData?.users?.teacher || 0}
              </Typography>
              <Typography
                align='center'
                variant="body2"
                color="text.secondary">Pengajar
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card onClick={e => { handleClick(e, { age: 'preteenAge' }) }} sx={{ padding: 1, justifyItems: 'center' }}>
            <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
              <Typography
                align='center'
                variant="h5"
                color="text.secondary"
              >{dashboardData?.users?.preteenAge || 0}
              </Typography>
              <Typography
                align='center'
                variant="body2"
                color="text.secondary">Pra Remaja
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card onClick={e => { handleClick(e, { age: 'teenAge' }) }} sx={{ padding: 1, justifyItems: 'center' }}>
            <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
              <Typography
                align='center'
                variant="h5"
                color="text.secondary"
              >{dashboardData?.users?.teenAge || 0}
              </Typography>
              <Typography
                align='center'
                variant="body2"
                color="text.secondary">Remaja
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card onClick={e => { handleClick(e, { age: 'premarriedAge' }) }} sx={{ padding: 1, justifyItems: 'center' }}>
            <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
              <Typography
                align='center'
                variant="h5"
                color="text.secondary"
              >{dashboardData?.users?.premarriedAge || 0}
              </Typography>
              <Typography
                align='center'
                variant="body2"
                color="text.secondary">Pra Nikah
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card onClick={e => { handleClick(e, { sex: 'male' }) }} sx={{ padding: 1, justifyItems: 'center' }}>
            <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
              <Typography
                align='center'
                variant="h5"
                color="text.secondary"
              >{dashboardData?.users?.male || 0}
              </Typography>
              <Typography
                align='center'
                variant="body2"
                color="text.secondary">Laki-Laki
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card onClick={e => { handleClick(e, { sex: 'female' }) }} sx={{ padding: 1, justifyItems: 'center' }}>
            <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
              <Typography
                align='center'
                variant="h5"
                color="text.secondary"
              >{dashboardData?.users?.female || 0}
              </Typography>
              <Typography
                align='center'
                variant="body2"
                color="text.secondary">Perempuan
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard