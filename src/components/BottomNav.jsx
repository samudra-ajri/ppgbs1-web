import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material"
import HomeIcon from '@mui/icons-material/HomeRounded'
import LoginIcon from '@mui/icons-material/LoginRounded'
import PersonIcon from '@mui/icons-material/PersonRounded'
import LogoutIcon from '@mui/icons-material/LogoutRounded'
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Box } from "@mui/system"
import { useDispatch, useSelector } from "react-redux"
import { logout, reset } from "../features/auth/authSlice"

function BottomNav() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [value, setValue] = useState(0)
  
  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <Box sx={{ pb: 5 }}>
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        {user ? (
          [
            <BottomNavigationAction key="home" component={Link} to="/" label="Home" icon={<HomeIcon />} />,
            <BottomNavigationAction key="logout" onClick={onLogout} label="Logout" icon={<LogoutIcon />} />
          ]
        ) : (
          [
            <BottomNavigationAction key="login" component={Link} to="/login" label="Login" icon={<LoginIcon />} />,
            <BottomNavigationAction key="register" component={Link} to="/register" label="Register" icon={<PersonIcon />} />
          ]
        )}
      </BottomNavigation>
    </Paper>
    </Box>
  )
}

export default BottomNav