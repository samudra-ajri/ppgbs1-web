import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ProfileCard from '../components/ProfileCard'
import { Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material'
import { getCompletionsScores, reset } from '../features/completions/completionSlice'
import { getSubjectCategories } from '../features/subjectCategories/subjectCategorySlice'
import { getUserById, reset as resetUser } from '../features/persons/personSlice'
import StatisticsCard from '../components/StatisticsCard'

function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userId = window.location.pathname.split('/')[3]
  const { user } = useSelector((state) => state.auth)
  const { user: person, isLoading, isSuccess: isSuccessPerson } = useSelector(
    (state) => state.persons
  )
  const { completions } = useSelector(
    (state) => state.completions
  )
  const { subjectCategories, isSuccess } = useSelector(
    (state) => state.subjectCategories
  )

  useEffect(() => {
    if (!user) navigate('/login')
    if (userId) dispatch(getUserById(userId))
    dispatch(getCompletionsScores())
    dispatch(getSubjectCategories())
    dispatch(reset())
    dispatch(resetUser())
  }, [user, userId, navigate, dispatch])

  const totalCompletion = Object.keys(completions).length !== 0 ? completions.totalPoin.total : 0
  const alquranCompletion = Object.keys(completions).length !== 0 ? completions.totalPoin.alquran : 0
  const haditsCompletion = Object.keys(completions).length !== 0 ? completions.totalPoin.hadits : 0
  const roteCompletion = Object.keys(completions).length !== 0 ? completions.totalPoin.rote : 0
  const extraCompletion = Object.keys(completions).length !== 0 ? completions.totalPoin.extra : 0

  const searchCategory = (categoryName) => {
    if (!isSuccess) return {}
    return subjectCategories.find(category => category._id === categoryName.toUpperCase())
  }

  const generateCategoryLink = (category) => {
    return `/c/targets/${category._id.toLowerCase()}`
  }

  if (userId && !isSuccessPerson) return (
    <Grid align="center" sx={{ pt: 1.5 }}>
      <CircularProgress size={20} />
    </Grid>
  )

  return (
    <>
      {user ? <ProfileCard user={userId ? person : user} /> : <></>}
      <Typography variant='h6' sx={{ mb: 1 }}>Poin Pencapaian</Typography>
      {!isSuccess ? (
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
            link='#'
          />
          <StatisticsCard
            key={'Alquran'}
            poin={alquranCompletion}
            name='Alquran'
            link={generateCategoryLink(searchCategory('Alquran'))}
          />
          <StatisticsCard
            key={'Hadits'}
            poin={haditsCompletion}
            name='Hadits'
            link={generateCategoryLink(searchCategory('Hadits'))}

          />
          <StatisticsCard
            key={'Extra'}
            poin={extraCompletion}
            name='Extra'
            link={generateCategoryLink(searchCategory('Extra'))}

          />
          <StatisticsCard
            key={'Rote'}
            poin={roteCompletion}
            name='Rote'
            link={generateCategoryLink(searchCategory('Rote'))}

          />
        </Grid>
      )}
    </>
  )
}

export default Profile