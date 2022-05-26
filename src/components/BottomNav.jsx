import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home'
import LoginIcon from '@mui/icons-material/Login'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
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
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        {user ? (
          <BottomNavigationAction onClick={onLogout} label="Logout" icon={<LogoutIcon />} />
        ) : (
          <>
            <BottomNavigationAction component={Link} to="/" label="Recents" icon={<HomeIcon />} />
            <BottomNavigationAction component={Link} to="/login" label="Login" icon={<LoginIcon />} />
            <BottomNavigationAction component={Link} to="/register" label="Register" icon={<PersonIcon />} />
          </>
        )}
      </BottomNavigation>
    </Paper>
    </Box>
  )
}

export default BottomNav
