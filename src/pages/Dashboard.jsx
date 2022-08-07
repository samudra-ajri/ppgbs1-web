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
  const { dashboardData } = useSelector(state => state.dashboard)
  const { locations } = useSelector((state) => state.locations)
  const [focusDs, setFocusDs] = useState(user?.role === 'PPG' || user?.role === 'ADMIN' ? 'SEMUA DS' : user?.ds)
  const [focusKlp, setFocusKlp] = useState(user?.role === 'PPG' || user?.role === 'ADMIN' || user?.role === 'PPD' ? 'SEMUA KLP' : user?.klp)

  useEffect(() => {
    if (!user) navigate('/login')
    if (user?.role === 'GENERUS') navigate('/profile')
    dispatch(getLocations())
    dispatch(getDashboard())
  }, [user, navigate, dispatch])

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
    // const filters = e.target.innerText === 'SEMUA DS'
    //   ? { ds: '', klp: '' }
    //   : { ds: e.target.innerText, klp: '' }

    setFocusDs(e.target.innerText)
    setFocusKlp('SEMUA KLP')
  }

  const onClickKlp = (e) => {
    // const filters = e.target.innerText === 'SEMUA KLP'
    //   ? { ds: focusDs, klp: '' }
    //   : { ds: focusDs, klp: e.target.innerText }

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
        <CounterCard title='Generus' value={dashboardData?.users?.generus} />
        <CounterCard title='Pengajar' value={dashboardData?.users?.pengajar} />
        <CounterCard title='Pra Remaja' value={dashboardData?.users?.preteenAge} size='small' />
        <CounterCard title='Remaja' value={dashboardData?.users?.teenAge} size='small' />
        <CounterCard title='Pra Nikah' value={dashboardData?.users?.premarriedAge} size='small' />
        <CounterCard title='Laki-laki' value={dashboardData?.users?.male}/>
        <CounterCard title='Perempuan' value={dashboardData?.users?.female}/>
        <CounterCard title='Total Capaian Materi' value={dashboardData?.scores?.total} size='large'/>
      </Grid>
    </>
  )
}

export default Dashboard