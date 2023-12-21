import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material"
import LoginIcon from '@mui/icons-material/LoginRounded'
import PersonIcon from '@mui/icons-material/PersonRounded'
import ProfileIcon from '@mui/icons-material/FaceOutlined'
import PeopleListIcon from '@mui/icons-material/PersonSearchOutlined'
import EventIcon from '@mui/icons-material/EventRounded'
import HomeIcon from '@mui/icons-material/HomeMaxRounded'
import CompletionIcon from '@mui/icons-material/GradingOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBackRounded'
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Box } from "@mui/system"
import { useSelector } from "react-redux"

function BottomNav() {
  const { user, alreadyDecidedPosition } = useSelector((state) => state.auth)
  const [value, setValue] = useState(0)
  const location = useLocation()
  const pathname = location.pathname

  return (
    <Box sx={{ pb: 10 }}>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue)
          }}
        >
          {user && alreadyDecidedPosition ? (
              user.currentPosition.type !== 'GENERUS' ? [
                <BottomNavigationAction key="menu" component={Link} to="/" label="Menu" value="menu" icon={pathname === '/' ? <HomeIcon fontSize="small"/> : <ArrowBackIcon fontSize="small"/>} />,
                <BottomNavigationAction key="users" component={Link} to="/users" label="Users" value="users" icon={<PeopleListIcon fontSize="small"/>} />,
                <BottomNavigationAction key="kegiatan" component={Link} to="/events" label="Kegiatan" value="kegiatan" icon={<EventIcon fontSize="small"/>} />,
                <BottomNavigationAction key="profile" component={Link} to="/profile" label="Profile" value="profile" icon={<ProfileIcon fontSize="small"/>} />,
              ] : [
                <BottomNavigationAction key="kegiatan" component={Link} to="/events" label="Kegiatan" value="kegiatan" icon={<EventIcon fontSize="small"/>} />,
                <BottomNavigationAction key="capaian" component={Link} to="/user-completion" label="Capaian Materi" value="capaian" icon={<CompletionIcon fontSize="small"/>} />,
                <BottomNavigationAction key="profile" component={Link} to="/profile" label="Profile" value="profile" icon={<ProfileIcon fontSize="small"/>} />,
              ]
          ) : (
            user && !alreadyDecidedPosition ? [] :
            [
              <BottomNavigationAction key="login" component={Link} to="/login" label="Masuk" value="login" icon={<LoginIcon fontSize="small"/>} />,
              <BottomNavigationAction key="register" component={Link} to="/register" label="Registrasi" value="register" icon={<PersonIcon fontSize="small"/>} />
            ]
          )}
        </BottomNavigation>
      </Paper>
    </Box>
  )
}

export default BottomNav
