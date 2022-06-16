import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import { getSubjectsByCategory, reset as resetSubject } from '../features/subjects/subjectSlice'
import TargetCard from '../components/TargetCard'
import { CircularProgress } from '@mui/material'
import { Box } from '@mui/system'
import LinearProgressWithLabel from '../components/LinearProgressWithLabel'
import { getCompletionsByCategory, reset } from '../features/completions/completionSlice'
import TargetChip from '../components/TargetChip'

function DetailTargets(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const rawTitle = props.path.split('/')
  const title = rawTitle[rawTitle.length - 1]
  const { user } = useSelector((state) => state.auth)
  const { subjects, isLoading: isLoadingSubjects } = useSelector(
    (state) => state.subjects
  )
  const { completions, isSuccess, isLoading: isLoadingCompletions } = useSelector(
    (state) => state.completions
  )

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getSubjectsByCategory(title))
    dispatch(getCompletionsByCategory(title))
    dispatch(reset())
    dispatch(resetSubject())
  }, [user, title, navigate, dispatch])

  const listSubjects = (subjects) => {
    if (Object.keys(subjects).length !== 0) return subjects.subjects
    return []
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
      <Box mt={1} mb={2}>
        <LinearProgressWithLabel value={
          isLoading() ? 0 : categoryPoin()
        } />
      </Box>
      {!isSuccess ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        listSubjects(subjects).length !== 1 ? (
          listSubjects(subjects).map((subject) => (
            <TargetCard
              key={subject.name}
              subject={subject}
            />
          ))
        ) : (
          <TargetChip subject={listSubjects(subjects)[0]} />
        )
      )}
    </>
  )
}

export default DetailTargets