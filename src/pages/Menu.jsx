import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Box, Grid, Typography } from "@mui/material"
import stringCast from "../utils/stringCast"
import BarIcon from "@mui/icons-material/EqualizerRounded"
import DashboardIcon from "@mui/icons-material/DataUsageRounded"
import PeopleListIcon from '@mui/icons-material/FaceOutlined'
import EventIcon from "@mui/icons-material/EventRounded"
import RestPasswordIcon from "@mui/icons-material/LockResetRounded"
import DashboardActivity from "@mui/icons-material/TimelineRounded"

import { kibanaUrl } from "../config"

function Menu() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) navigate("/login")
    if (user?.currentPosition.type === "GENERUS") navigate("/user-completion")
  }, [user, navigate, dispatch])

  if (!user) return

  return (
    <>
      <Typography variant='body2'><b>Hi, {stringCast.ppg(user.name)}</b></Typography>
      <Box sx={{ flexGrow: 1 }} paddingTop={5}>
        <Grid container spacing={2}>
          <Grid item xs={4} textAlign='center' component={Link} to='/dashboard'>
            <DashboardIcon fontSize='large' color='info'/>
            <Typography sx={{fontSize: '12px'}}>Dashboard</Typography>
          </Grid>
          <Grid item xs={4} textAlign='center' component={Link} to='/events'>
            <EventIcon fontSize='large' color='info'/>
            <Typography sx={{fontSize: '12px'}}>Kegiatan</Typography>
          </Grid>
          <Grid item xs={4} textAlign='center' component={Link} to='/completion'>
            <BarIcon fontSize='large' color='info'/>
            <Typography sx={{fontSize: '12px'}}>Materi</Typography>
          </Grid>
          <Grid item xs={4} textAlign='center' component={Link} to='/users'>
            <PeopleListIcon fontSize='large' color='info'/>
            <Typography sx={{fontSize: '12px'}}>Users</Typography>
          </Grid>
          <Grid item xs={4} textAlign='center' component={Link} to='/reset-passwords'>
            <RestPasswordIcon fontSize='large' color='info'/>
            <Typography sx={{fontSize: '12px'}}>Reset User Password</Typography>
          </Grid>
          <Grid item xs={4} textAlign='center'>
            <a href={kibanaUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <DashboardActivity fontSize='large' color='info'/>
              <Typography sx={{ fontSize: '12px' }}>Log Aktivitas</Typography>
            </a>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Menu
