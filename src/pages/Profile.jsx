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

  const totalTarget = {
    name: 'Total Pencapaian',
    totalPoin: (Object.keys(subjects).length !== 0) ? subjects.totalPoin : 0.0001
  }

  const totalCompletion = {
    name: 'Total Poin',
    poin: (Object.keys(completions).length !== 0) ? completions.totalPoin : 0
  }

  return (
    <>
      <ProfileCard user={user} />
      <Typography variant="h6">Poin Pencapaian</Typography>
      <Grid container spacing={1} sx={{ mb: 1 }}>
      <StatisticsCard
          key={'Total'}
          poin={(Object.keys(completions).length !== 0) ? completions.totalPoin : 0}
          name='Total'
        />
        <StatisticsCard
          key={'Alquran'}
          poin={50}
          name='Alquran'
        />
        <StatisticsCard
          key={'Hadits'}
          poin={50}
          name='Hadits'
        />
        <StatisticsCard
          key={'Rote'}
          poin={50}
          name='Hafalan'
        />
        <StatisticsCard
          key={'Support'}
          poin={80}
          name='Penunjang'
        />
      </Grid>
        {isLoading() ? (
          <Card align="center">
            <CardContent>
              <CircularProgress size="2.3rem" />
            </CardContent>
          </Card>
        ) : (
          listSubjects(subjects).map((subject) => (
            <TargetCard
              key={subject.name}
              subject={subject}
              completion={getCompletionBySubject(listCompletions(completions), subject._id)}
            />
          ))
        )}
    </>
  )
}

export default Profile