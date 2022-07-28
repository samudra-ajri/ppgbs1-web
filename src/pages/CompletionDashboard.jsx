import { Grid, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CircularProgressWithLabel from '../components/CircularProgressWithLabel'
import { getAllCompletionsScores, reset } from '../features/completions/completionSlice'
import { getRolesCounter } from '../features/userCounters/userCounterSlice'

function CompletionDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  const { completions } = useSelector((state) => state.completions)
  const { countList } = useSelector((state) => state.usersCounter)

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getAllCompletionsScores())
    dispatch(getRolesCounter())
    dispatch(reset())
  }, [user, navigate, dispatch])

  const totalPoins = completions?.totalPoin ?? null
  const alquranScore = totalPoins?.find(o => o._id === 'ALQURAN').total ?? 0
  const haditsScore = totalPoins?.find(o => o._id === 'HADITS').total ?? 0
  const roteScore = totalPoins?.find(o => o._id === 'ROTE').total ?? 0
  const extraScore = totalPoins?.find(o => o._id === 'EXTRA').total ?? 0
  const totalScore = alquranScore + haditsScore + roteScore + extraScore
  const generusCount = countList?.countRoles?.find(o => o._id === 'GENERUS').total ?? 0.001

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Capaian Materi Generus</Typography>
      <Grid container align='center' spacing={1}>
        <CircularProgressWithLabel value={totalScore/(2297*generusCount)*100} title='Total' />
        <CircularProgressWithLabel value={alquranScore/(605*generusCount)*100} title='Alquran' />
        <CircularProgressWithLabel value={haditsScore/(1604*generusCount)*100} title='Alhadits' />
        <CircularProgressWithLabel value={extraScore/(14*generusCount)*100} title='Penunjang' />
        <CircularProgressWithLabel value={roteScore/(74*generusCount)*100} title='Hafalan' />
      </Grid>
    </>
  )
}

export default CompletionDashboard