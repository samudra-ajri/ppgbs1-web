import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import { getSubjectsByCategory } from '../features/subjects/subjectSlice'
import TargetCard from '../components/TargetCard'
import { CircularProgress } from '@mui/material'
import { Box } from '@mui/system'
import LinearProgressWithLabel from '../components/LinearProgressWithLabel'

function DetailTargets(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const rawTitle = props.path.split('/')
  const title = rawTitle[rawTitle.length - 1]
  const { user } = useSelector((state) => state.auth)
  const { subjects, isLoading: isLoadingSubjects } = useSelector(
    (state) => state.subjects
  )

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getSubjectsByCategory(title))
  }, [user, title, navigate, dispatch])

  const listSubjects = (subjects) => {
    if (Object.keys(subjects).length !== 0) return subjects.subjects
    return []
  }

  const isLoading = () => {
    if (isLoadingSubjects) return true
    return false
  }

  return (
    <>
      <BackHeader title={title}/>
      <Box mt={1} mb={2}>
      <LinearProgressWithLabel value={isLoading() ? 0 : subjects.totalPoin} />

      </Box>
      {isLoading() ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
      ) : (
        listSubjects(subjects).map((subject) => (
          <TargetCard
            key={subject.name}
            subject={subject}
          />
        ))
      )}
    </>
  )
}

export default DetailTargets