import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ProfileCard from "../components/ProfileCard"
import {
  reset,
} from "../features/completionScores/completionScoreSlice"

function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userId = window.location.pathname.split("/")[3]
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) navigate("/login")
    dispatch(reset())
  }, [user, userId, navigate, dispatch])

  return (
    <>
      <ProfileCard user={user} />
    </>
  )
}

export default Profile
