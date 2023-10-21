import { Typography } from "@mui/material"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import DecidePositionCard from "../components/DecidePositionCard"
import { decidePosition, reset } from "../features/auth/authSlice"

function DecidePosition() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, alreadyDecidedPosition } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) navigate("/login")

    if (user.positions.length === 1) {
      dispatch(decidePosition(user.positions[0].positionId))
      navigate("/profile")
    }
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
