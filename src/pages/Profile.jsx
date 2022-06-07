import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ProfileCard from '../components/ProfileCard'
import TargetCard from '../components/TargetCard'
import { Typography } from '@mui/material'
import { getSubjects } from '../features/subjects/subjectSlice'

function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { subjects, isLoading: isLoadingSubjects } = useSelector(
    (state) => state.subjects
  )

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getSubjects())
  }, [user, navigate, dispatch])

  const listSubjects = (subjects) => {
    if (Object.keys(subjects).length !== 0) return subjects.subjects
    return []
  }

  return (
    <>
      <ProfileCard user={user} />
      <Typography variant="h6">
        Target
      </Typography>
      {listSubjects(subjects).map((subject) => (
        <TargetCard key={subject.name} subject={subject} />
      ))}
    </>
  )
}

export default Profile