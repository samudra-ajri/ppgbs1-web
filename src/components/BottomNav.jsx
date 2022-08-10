import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material"
import LoginIcon from '@mui/icons-material/LoginRounded'
import PersonIcon from '@mui/icons-material/PersonRounded'
import ProfileIcon from '@mui/icons-material/FaceOutlined'
import BarIcon from '@mui/icons-material/EqualizerRounded';
import DashboardIcon from '@mui/icons-material/DataUsageRounded';
import PeopleListIcon from '@mui/icons-material/RecentActorsOutlined';
import { useState } from "react"
import { Link } from "react-router-dom"
import { Box } from "@mui/system"
import { useSelector } from "react-redux"

function BottomNav() {
  const { user } = useSelector((state) => state.auth)
  const [value, setValue] = useState(0)

  return (
    <Box sx={{ pb: 10 }}>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          {user ? (
              user.role !== 'GENERUS' ? [
                <BottomNavigationAction key="dashboard" component={Link} to="/" label="Dashboard" value="dashboard" icon={<DashboardIcon />} />,
                <BottomNavigationAction key="progress" component={Link} to="/completion" label="Materi" value="progress" icon={<BarIcon />} />,
                <BottomNavigationAction key="generus" component={Link} to="/users" label={user.role === "ADMIN" ? "Users" : "Users"} value="generus" icon={<PeopleListIcon />} />,
              ] : [
                <BottomNavigationAction key="profile" component={Link} to="/profile" label="Akun Saya" value="profile" icon={<ProfileIcon />} />,
              ]
          ) : (
            [
              <BottomNavigationAction key="login" component={Link} to="/login" label="Masuk" value="login" icon={<LoginIcon />} />,
              <BottomNavigationAction key="register" component={Link} to="/register" label="Registrasi" value="register" icon={<PersonIcon />} />
            ]
          )}
        </BottomNavigation>
      </Paper>
    </Box>
  )
}

export default BottomNav
