import { Fab, Typography } from "@mui/material"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import BackHeader from "../components/BackHeader"
import PresenceList from "../components/PresenceList"
import { getEvent, reset } from "../features/event/eventSlice"
import { downloadPresenceData } from "../features/presences/presenceSlice"

function EventPresence() {
  const location = useLocation()
  const eventId = location.pathname.split("/")[3]

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { event, isSuccess } = useSelector((state) => state.events)

  useEffect(() => {
    if (!user) navigate("/login")
    dispatch(getEvent(eventId))
    return () => {
      dispatch(reset())
    }
  }, [user, eventId, navigate, dispatch])

  const onClickDownload = () => {
    dispatch(downloadPresenceData({ eventId }))
      .unwrap()
      .then((blob) => {
        // Create a Blob from the response
        const file = new Blob([blob], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })

        // Build a URL from the file
        const fileURL = URL.createObjectURL(file)

        // Create a temp <a> tag to download file
        const link = document.createElement("a")
        link.href = fileURL
        link.setAttribute("download", `presensi-${event.data.name}-${Date.now()}.xlsx`) // Name the file
        document.body.appendChild(link)
        link.click()

        // Cleanup
        link.parentNode.removeChild(link)
        URL.revokeObjectURL(fileURL)
      })
      .catch((error) => {
        // Handle error here
        console.error("Error downloading the file: ", error)
      })
  }

  return (
    <>
      <BackHeader title='Kehadiran' />
      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Daftar Hadir
      </Typography>

      {isSuccess && (
        <>
          <PresenceList event={event.data} user={user} />
        </>
      )}

      <Fab
        size='medium'
        color='success'
        aria-label='download excel'
        onClick={onClickDownload}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <FileDownloadOutlinedIcon />
      </Fab>
    </>
  )
}

export default EventPresence
