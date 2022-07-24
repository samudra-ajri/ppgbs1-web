import { Box, CircularProgress, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import TargetChip from '../components/TargetChip'
import { getSubject, reset } from '../features/subjectDetails/subjectDetailsSlice'
import { getCompletionBySubjectId, getUserCompletionBySubjectId,reset as resetCompletion } from '../features/completionDetails/completionDetailsSlice'

function InputTargets() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const rawTitle = window.location.pathname.split('/')
  const subjectId = rawTitle[3]
  const userId = rawTitle[4]
  const { user } = useSelector((state) => state.auth)
  const { subjectDetails, isSuccess } = useSelector(
    (state) => state.subjectDetails
  )
  const { completionDetails, isSuccess: isSuccesCompletion } = useSelector(
    (state) => state.completionDetails
  )

  useEffect(() => {
    if (!user) navigate('/login')
    if (userId) {
      dispatch(getUserCompletionBySubjectId({ subjectId, userId }))
    } else {
      dispatch(getCompletionBySubjectId(subjectId))
    }
    dispatch(getSubject(subjectId))
    dispatch(reset())
    dispatch(resetCompletion())
  }, [user, subjectId, userId, navigate, dispatch])

  const title = () => {
    if (
      (isSuccess && subjectDetails.category === 'ALQURAN') ||
      (isSuccess && subjectDetails.category === 'HADITS')
    ) return 'Target Halaman'
    return 'Target Materi'
  }

  const generateTargetsCompleted = () => {
    const targetCompleted = {}
    const initCompleted = completionDetails?.completed || []

    const isCompleted = (completed, target) => {
      return completed.find(element => element === target);
    }
    
    subjectDetails.targets.map((target) => (
      targetCompleted[target] = isCompleted(initCompleted, target) ? true : false
    ))

    return targetCompleted
  }

  return (
    <>
      {isSuccess && isSuccesCompletion ? (
        <>
          <Box mb={2}>
            <Typography variant="h7" component="div">{title()}</Typography>
          </Box>
          <Box mb={5}>
            <TargetChip
              subject={isSuccess ? subjectDetails : null}
              completion={isSuccesCompletion ? completionDetails : null}
              targetCompleted={generateTargetsCompleted()}
            />
          </Box>
        </>
      ) : (
        <Box mt={11} sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
    </>
  )
}

export default InputTargets