import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ProfileCard from '../components/ProfileCard'
import TargetCard from '../components/TargetCard'
import { Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material'
import { getSubjects } from '../features/subjects/subjectSlice'
import { getCompletions } from '../features/completions/completionSlice'
import StatisticsCard from '../components/StatisticsCard'

function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { subjects, isLoading: isLoadingSubjects } = useSelector(
    (state) => state.subjects
  )
  const { completions, isLoading: isLoadingCompletions } = useSelector(
    (state) => state.completions
  )

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getSubjects())
    dispatch(getCompletions())
  }, [user, navigate, dispatch])

  const listSubjects = (subjects) => {
    if (Object.keys(subjects).length !== 0) return subjects.subjects
    return []
  }

  const listCompletions = (completions) => {
    if (Object.keys(completions).length !== 0) return completions.completions
    return []
  }

  const getCompletionBySubject = (completions, subjectId) => {
    return completions.find(({ subject }) => subject === subjectId)
  }

  const isLoading = () => {
    if (isLoadingSubjects || isLoadingCompletions) return true
    return false
  }

  const totalCompletion = Object.keys(completions).length !== 0 ? completions.totalPoin.total : 0
  const alquranCompletion = Object.keys(completions).length !== 0 ? completions.totalPoin.alquran : 0
  const haditsCompletion = Object.keys(completions).length !== 0 ? completions.totalPoin.hadits : 0
  const roteCompletion = Object.keys(completions).length !== 0 ? completions.totalPoin.rote : 0
  const extraCompletion = Object.keys(completions).length !== 0 ? completions.totalPoin.extra : 0

  return (
    <>
      {user ? <ProfileCard user={user} /> : <></>}
      <Typography variant='h6' sx={{ mb: 1 }}>Poin Pencapaian</Typography>
      {isLoading() ? (
        <Card align="center" sx={{ mb: 1 }}>
          <CardContent>
            <CircularProgress size="3rem" />
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <StatisticsCard
            key={'Total'}
            poin={totalCompletion}
            name='Total'
          />
          <StatisticsCard
            key={'Alquran'}
            poin={alquranCompletion}
            name='Alquran'
          />
          <StatisticsCard
            key={'Hadits'}
            poin={haditsCompletion}
            name='Hadits'
          />
          <StatisticsCard
            key={'Support'}
            poin={extraCompletion}
            name='Penunjang'
          />
          <StatisticsCard
            key={'Rote'}
            poin={roteCompletion}
            name='Hafalan'
          />
        </Grid>
      )}

      {listSubjects(subjects).map((subject) => (
        <TargetCard
          key={subject.name}
          subject={subject}
          completion={getCompletionBySubject(listCompletions(completions), subject._id)}
        />
      ))}
    </>
  )
}

export default Profile