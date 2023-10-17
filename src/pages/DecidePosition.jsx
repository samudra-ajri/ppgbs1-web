import { Typography } from "@mui/material"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import DecidePositionCard from "../components/DecidePositionCard"
// import PresenceForm from '../components/PresenceForm'
// import { getEvent, reset } from '../features/event/eventSlice'

function DecidePosition() {
  // const eventId = window.location.pathname.split('/')[3]
  // const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  // const { event, isSuccess } = useSelector((state) => state.events)

  useEffect(() => {
    if (!user) navigate("/login")
    // dispatch(getEvent(eventId))
    // dispatch(reset())
    // }, [user, eventId, navigate, dispatch])
  }, [user, navigate])

  return (
    <>
      <Typography variant='h5' align='center' sx={{ pb: 4 }}>
        Login dengan Akun
      </Typography>
      {user.positions.map((position) => (
        <DecidePositionCard position={position} key={position.positionId}/>
      ))}
    </>
  )
}

export default DecidePosition
