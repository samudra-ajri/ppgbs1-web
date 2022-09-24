import { Box, Card, Chip, Grid, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CircularProgressWithLabel from '../components/CircularProgressWithLabel'
import { getAllCompletionsScores, reset } from '../features/completionScores/completionScoreSlice'
import { getRolesCounter } from '../features/userCounters/userCounterSlice'
import { useState } from 'react'
import { listDs, listKlp } from '../helpers/locationHelper'

function CompletionDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  const { completionScores, isLoading } = useSelector((state) => state.completionScores)
  const { countList, isLoading: isLoadingUserCounter } = useSelector((state) => state.usersCounter)
  const [focusDs, setFocusDs] = useState(user?.role === 'PPG' || user?.role === 'ADMIN' ? 'SEMUA DS' : user?.ds)
  const [focusKlp, setFocusKlp] = useState(user?.role !== 'PPK' ? 'SEMUA KLP' : user?.klp)

  useEffect(() => {
    if (!user) navigate('/login')
    if (user?.role === 'PPG' || user?.role === 'ADMIN') {
      dispatch(getAllCompletionsScores({ ds: '', klp: '' }))
      dispatch(getRolesCounter({ ds: '', klp: '' }))

    } else if (user?.role === 'PPD' || user?.role === 'MT' || user?.role === 'MS') {
      dispatch(getAllCompletionsScores({ ds: user.ds, klp: '' }))
      dispatch(getRolesCounter({ ds: user.ds, klp: '' }))

    } else if (user?.role === 'PPK') {
      dispatch(getAllCompletionsScores({ ds: user.ds, klp: user.klp }))
      dispatch(getRolesCounter({ ds: user.ds, klp: user.klp }))
    }
    dispatch(reset())
  }, [user, navigate, dispatch])

  const onClickDs = (e) => {
    const filters = e.target.innerText === 'SEMUA DS'
      ? { ds: '', klp: '' }
      : { ds: e.target.innerText, klp: '' }

    setFocusDs(e.target.innerText)
    setFocusKlp('SEMUA KLP')
    dispatch(getAllCompletionsScores(filters))
    dispatch(getRolesCounter(filters))
  }

  const onClickKlp = (e) => {
    const filters = e.target.innerText === 'SEMUA KLP'
      ? { ds: focusDs, klp: '' }
      : { ds: focusDs, klp: e.target.innerText }

    setFocusKlp(e.target.innerText)
    dispatch(getAllCompletionsScores(filters))
    dispatch(getRolesCounter(filters))
  }

  const loading = isLoading || isLoadingUserCounter
  const totalPoins = completionScores?.totalPoin ?? null
  const generusCount = (countList?.countRoles?.find(o => o._id === 'GENERUS'))?.total

  const alquranPercentage = ((totalPoins?.find(o => o._id === 'ALQURAN'))?.total ?? 0) / (605 * (generusCount ?? 100000)) * 100
  const haditsPercentage = ((totalPoins?.find(o => o._id === 'HADITS'))?.total ?? 0) / (1604 * (generusCount ?? 100000)) * 100
  const rotePercentage = ((totalPoins?.find(o => o._id === 'ROTE'))?.total ?? 0) / (74 * (generusCount ?? 100000)) * 100
  const extraPercentage = ((totalPoins?.find(o => o._id === 'EXTRA'))?.total ?? 0) / (14 * (generusCount ?? 100000)) * 100
  const total = totalPoins?.reduce((acc, curr) => acc + curr?.total, 0) || 0
  const totalPercentage = total / (2297 * (generusCount ?? 100000)) * 100

  const queryParams = `ds=${focusDs.toLowerCase().replace(" ", "-")}&klp=${focusKlp.toLowerCase().replace(" ", "-")}`

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
          {listDs().map(ds => <Chip
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
      {((user?.role !== 'PPK' ) && focusDs !== 'SEMUA DS') &&
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
          {(focusDs ? listKlp(focusDs) : []).map(klp => <Chip
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
        <Grid item xs={12}>
          <Card sx={{ padding: 1, justifyItems: 'center' }}>
            <Box sx={{ position: 'relative' }}>
              <Typography align='center' variant="h6" color="text.secondary">{generusCount ?? 0}</Typography>
              <Typography align='center' variant="caption" color="text.secondary">Generus</Typography>
            </Box>
          </Card>
        </Grid>
        <CircularProgressWithLabel
          value={totalPercentage}
          title='Seluruh Materi'
          isloading={loading.toString()}
          sizePosition='top'
          link='#' />
        <CircularProgressWithLabel
          value={alquranPercentage}
          title='Alquran'
          isloading={loading.toString()}
          link={`/c/targets-completed/alquran?${queryParams}`} />
        <CircularProgressWithLabel
          value={haditsPercentage}
          title='Alhadits'
          isloading={loading.toString()}
          link={`/c/targets-completed/hadits?${queryParams}`} />
        <CircularProgressWithLabel
          value={extraPercentage}
          title='Penunjang'
          isloading={loading.toString()}
          link={`/c/targets-completed/extra?${queryParams}`} />
        <CircularProgressWithLabel
          value={rotePercentage}
          title='Hafalan'
          isloading={loading.toString()}
          link={`/c/targets-completed/rote?${queryParams}`} />
      </Grid>
    </>
  )
}

export default CompletionDashboard