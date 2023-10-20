import { Typography } from "@mui/material"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import DecidePositionCard from "../components/DecidePositionCard"
import { reset } from "../features/auth/authSlice"

function DecidePosition() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { alreadyDecidedPosition } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) navigate("/login")
    if (user.positions.length === 1) navigate("/profile")
    if (alreadyDecidedPosition) navigate("/profile")
    dispatch(reset())
  }, [user, alreadyDecidedPosition, navigate, dispatch])

  return (
    <>
      <Typography variant='h5' align='center' sx={{ pb: 4 }}>
        Login dengan Akun
      </Typography>
      {user.positions.map((position) => (
        <DecidePositionCard position={position} key={position.positionId} />
      ))}
    </>
  )
}

export default DecidePosition
