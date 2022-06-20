import { Box, CircularProgress, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import TargetChip from '../components/TargetChip'
import { getSubject, reset } from '../features/subjectDetails/subjectDetailsSlice'
import { getCompletionBySubjectId, reset as resetCompletion } from '../features/completionDetails/completionDetailsSlice'

function InputTargets() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const rawTitle = window.location.pathname.split('/')
  const subjectId = rawTitle[rawTitle.length - 1]
  const { user } = useSelector((state) => state.auth)
  const { subjectDetails, isSuccess } = useSelector(
    (state) => state.subjectDetails
  )
  const { completionDetails, isSuccess: isSuccesCompletion } = useSelector(
    (state) => state.completionDetails
  )

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getSubject(subjectId))
    dispatch(getCompletionBySubjectId(subjectId))
    dispatch(reset())
    dispatch(resetCompletion())
  }, [user, subjectId, navigate, dispatch])

  const title = () => {
    if (
      (isSuccess && subjectDetails.category === 'ALQURAN') ||
      (isSuccess && subjectDetails.category === 'HADITS')
    ) return 'Target Halaman'
    return 'Target Materi'
  }

  return (
    <>
      <Box mt={11} mb={2}>
        <Typography variant="h7" component="div">{title()}</Typography>
      </Box>
      {isSuccess && isSuccesCompletion ? (
        <Box mb={10}>
          <TargetChip 
            subject={isSuccess ? subjectDetails : null} 
            completion={isSuccesCompletion ? completionDetails : null} 
          />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
    </>
  )
}

export default InputTargets