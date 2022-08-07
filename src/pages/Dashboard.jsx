import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Chip, Grid, Typography } from '@mui/material'
import { getDashboard } from '../features/Dashboards/dashboardSlice'
import { useState } from 'react'
import { getLocations } from '../features/locations/locationSlice'
import CounterCard from '../components/CounterCard'

function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { dashboardData, isLoading } = useSelector(state => state.dashboard)
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
            name={klp}
            color='info'
            sx={{ m: 0.25 }}
            onClick={onClickKlp}
          />)}
        </Box>
      }

      <Grid container align='center' spacing={1}>
        <CounterCard title='Generus' value={dashboardData?.users?.generus} isLoading={isLoading.toString()}/>
        <CounterCard title='Pengajar' value={dashboardData?.users?.pengajar} isLoading={isLoading.toString()}/>
        <CounterCard title='Pra Remaja' value={dashboardData?.users?.preteenAge} size='small' isLoading={isLoading.toString()}/>
        <CounterCard title='Remaja' value={dashboardData?.users?.teenAge} size='small' isLoading={isLoading.toString()}/>
        <CounterCard title='Pra Nikah' value={dashboardData?.users?.premarriedAge} size='small' isLoading={isLoading.toString()}/>
        <CounterCard title='Laki-laki' value={dashboardData?.users?.male} isLoading={isLoading.toString()}/>
        <CounterCard title='Perempuan' value={dashboardData?.users?.female} isLoading={isLoading.toString()}/>
        <CounterCard title='Total Capaian Materi' value={dashboardData?.scores?.total} size='large' isLoading={isLoading.toString()}/>
      </Grid>
    </>
  )
}

export default Dashboard