import { Box, Chip, Grid, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CircularProgressWithLabel from '../components/CircularProgressWithLabel'
import { getAllCompletionsScores, reset } from '../features/completions/completionSlice'
import { getRolesCounter } from '../features/userCounters/userCounterSlice'
import { getLocations } from '../features/locations/locationSlice'
import { useState } from 'react'

function CompletionDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  const { completions } = useSelector((state) => state.completions)
  const { countList } = useSelector((state) => state.usersCounter)
  const { locations } = useSelector((state) => state.locations)
  const [focusDs, setFocusDs] = useState('SEMUA DS')
  const [focusKlp, setFocusKlp] = useState('SEMUA KLP')

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getAllCompletionsScores({ ds: '', klp: '' }))
    dispatch(getRolesCounter())
    dispatch(getLocations())
    dispatch(reset())
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
    const filters = e.target.innerText === 'SEMUA DS' 
      ? { ds: '', klp: '' } 
      : { ds: e.target.innerText, klp: '' }

    setFocusDs(e.target.innerText)
    setFocusKlp('SEMUA KLP')
    dispatch(getAllCompletionsScores(filters))
  }

  const onClickKlp = (e) => {
    const filters = e.target.innerText === 'SEMUA KLP' 
      ? { ds: focusDs, klp: '' } 
      : { ds: focusDs, klp: e.target.innerText }

    setFocusKlp(e.target.innerText)
    dispatch(getAllCompletionsScores(filters))
  }

  const totalPoins = completions?.totalPoin ?? null
  const alquranScore = (totalPoins?.find(o => o._id === 'ALQURAN'))?.total ?? 0
  const haditsScore = (totalPoins?.find(o => o._id === 'HADITS'))?.total ?? 0
  const roteScore = (totalPoins?.find(o => o._id === 'ROTE'))?.total ?? 0
  const extraScore = (totalPoins?.find(o => o._id === 'EXTRA'))?.total ?? 0
  const totalScore = alquranScore + haditsScore + roteScore + extraScore
  const generusCount = countList?.countRoles?.find(o => o._id === 'GENERUS').total ?? 0.001

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Capaian Materi Generus</Typography>
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
        <CircularProgressWithLabel value={totalScore / (2297 * generusCount) * 100} title='Total' />
        <CircularProgressWithLabel value={alquranScore / (605 * generusCount) * 100} title='Alquran' />
        <CircularProgressWithLabel value={haditsScore / (1604 * generusCount) * 100} title='Alhadits' />
        <CircularProgressWithLabel value={extraScore / (14 * generusCount) * 100} title='Penunjang' />
        <CircularProgressWithLabel value={roteScore / (74 * generusCount) * 100} title='Hafalan' />
      </Grid>
    </>
  )
}

export default CompletionDashboard