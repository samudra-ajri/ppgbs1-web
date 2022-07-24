import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import { getSubjectsByCategory, reset as resetSubject } from '../features/subjects/subjectSlice'
import TargetCard from '../components/TargetCard'
import { CircularProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'
import LinearProgressWithLabel from '../components/LinearProgressWithLabel'
import { getCompletionsByCategory, getUserCompletionsByCategory, reset } from '../features/completions/completionSlice'

function DetailTargets() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const rawTitle = window.location.pathname.split('/')
  const title = rawTitle[3]
  const userId = rawTitle[4]
  const { user } = useSelector((state) => state.auth)
  const { subjects, isLoading: isLoadingSubjects } = useSelector(
    (state) => state.subjects
  )
  const { completions, isSuccess, isLoading: isLoadingCompletions } = useSelector(
    (state) => state.completions
  )

  useEffect(() => {
    if (!user) navigate('/login')
    if (userId) {
      dispatch(getUserCompletionsByCategory({ title, userId }))
    } else {
      dispatch(getCompletionsByCategory(title))
    }
    dispatch(getSubjectsByCategory(title))
    dispatch(reset())
    dispatch(resetSubject())
  }, [user, title, userId, navigate, dispatch])

  const listSubjects = (subjects) => {
    if (Object.keys(subjects).length !== 0) return subjects.subjects
    return []
  }

  const listCompletions = (completions) => {
    if (Object.keys(completions).length !== 0) return completions.completions
    return []
  }

  const getCompletionBySubject = (completions, subjectId) => {
    if (completions && completions.length !== 0) return completions.find(({ subject }) => subject === subjectId)
    return {}
  }

  const isLoading = () => {
    if (isLoadingSubjects && isLoadingCompletions) return true
    return false
  }

  const categoryPoin = () => {
    if (
      Object.keys(subjects).length !== 0 &&
      Object.keys(completions).length !== 0
    ) return completions.totalPoin.total / subjects.totalPoin * 100
    return 0
  }

  return (
    <>
      <BackHeader title={title} />
      <Box mb={2}>
        <Typography variant="h7" component="b">
          Total
        </Typography>
        <LinearProgressWithLabel value={
          isLoading() ? 0 : categoryPoin()
        } />
      </Box>
      {!isSuccess ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box mb={5}>
          {listSubjects(subjects).map((subject) => (
            <TargetCard
              key={subject.name}
              userId={userId}
              subject={subject}
              completion={getCompletionBySubject(listCompletions(completions), subject._id)}
            />
          ))}
        </Box>
      )}
    </>
  )
}

export default DetailTargets