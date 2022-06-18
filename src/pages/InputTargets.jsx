import { Box, CircularProgress, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import TargetChip from '../components/TargetChip'
import { getSubject, reset } from '../features/subjectDetails/subjectDetailsSlice'

function InputTargets(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const rawTitle = window.location.pathname.split('/')
  const subjectId = rawTitle[rawTitle.length - 1]
  const { user } = useSelector((state) => state.auth)
  const { subjectDetails, isSuccess } = useSelector(
    (state) => state.subjectDetails
  )

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getSubject(subjectId))
    dispatch(reset())
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
      <BackHeader title={isSuccess ? subjectDetails.name : ''} />
      <Box mt={1} mb={1}>
        <Typography variant="h7" component="div">{title()}</Typography>
      </Box>
      {isSuccess ? (
        <TargetChip subject={isSuccess ? subjectDetails : null}/>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
    </>
  )
}

export default InputTargets