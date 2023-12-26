import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Typography } from "@mui/material"
import ProfileMenuCard from "../components/ProfileMenuCard"
import { logout, reset } from "../features/auth/authSlice"
import ProfileCard from "../components/ProfileCard"

function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) navigate("/login")
    dispatch(reset())
  }, [user, navigate, dispatch])

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate("/")
  }

  const generusCard = () =>
    user.currentPosition.type === "GENERUS" && (
      <>
        <ProfileMenuCard title='Biodata' link='/c/edit-profile' />
        <ProfileMenuCard title='Kelas' link='#' />
      </>
    )

  const pengajarCard = () =>
    user.currentPosition.type === "PENGAJAR" && (
      <>
        <ProfileMenuCard title='Biodata' link='/c/edit-profile' />
        <ProfileMenuCard title='Kemuballighan' link='#' />
      </>
    )

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>
        Profile
      </Typography>
      <ProfileCard user={user} />
      {generusCard()}
      {pengajarCard()}
      <ProfileMenuCard title='Ubah Password' link='#' />
      <Typography
        mt={5}
        align='center'
        variant='subtitle1'
        color='red'
        style={{ cursor: "pointer", fontWeight: "bold" }}
        onClick={onLogout}
      >
        Logout
      </Typography>
    </>
  )
}

export default Profile
