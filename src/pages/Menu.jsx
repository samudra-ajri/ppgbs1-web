import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Box, Grid, Typography } from "@mui/material"
import BarIcon from "@mui/icons-material/EqualizerRounded"
import PeopleListIcon from "@mui/icons-material/PersonSearchOutlined"
import EventIcon from "@mui/icons-material/EventRounded"
import RestPasswordIcon from "@mui/icons-material/LockResetRounded"
// import DashboardActivity from "@mui/icons-material/TimelineRounded"
// import { kibanaUrl } from "../config"

function Menu() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user || !user.exp) navigate("/login")
    if (user?.currentPosition?.type === "GENERUS") navigate("/user-completion")
  }, [user, navigate, dispatch])

  if (!user) return

  return (
    <>
      <Typography variant='body2' align='center'>
        <b>Hi, {user?.name}</b>
      </Typography>
      <Box sx={{ flexGrow: 1 }} paddingTop={5}>
        <Grid container spacing={2}>
          <Grid item xs={6} textAlign='center' component={Link} to='/events'>
            <EventIcon fontSize='large' color='info' />
            <Typography sx={{ fontSize: "12px" }}>Kegiatan</Typography>
          </Grid>
          <Grid
            item
            xs={4}
            textAlign='center'
            component={Link}
            to='/group-completion'
          >
            <BarIcon fontSize='large' color='info' />
            <Typography sx={{ fontSize: "12px" }}>Capaian Materi</Typography>
          </Grid>
          <Grid item xs={6} textAlign='center' component={Link} to='/users'>
            <PeopleListIcon fontSize='large' color='info' />
            <Typography sx={{ fontSize: "12px" }}>Users</Typography>
          </Grid>
          <Grid
            item
            xs={4}
            textAlign='center'
            component={Link}
            to='/reset-passwords'
          >
            <RestPasswordIcon fontSize='large' color='info' />
            <Typography sx={{ fontSize: "12px" }}>
              Reset User Password
            </Typography>
          </Grid>
          {/* <Grid item xs={6} textAlign='center'>
            <a
              href={kibanaUrl}
              target='_blank'
              rel='noopener noreferrer'
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <DashboardActivity fontSize='large' color='info' />
              <Typography sx={{ fontSize: "12px" }}>Log Aktivitas</Typography>
            </a>
          </Grid> */}
        </Grid>
      </Box>
    </>
  )
}

export default Menu
