import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/LogoutRounded'
import { logout, reset } from "../features/auth/authSlice"

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <>
      <AppBar color='default'>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} translate='no'>
            P I G A R U
          </Typography>
          {user ? (<IconButton onClick={onLogout}><LogoutIcon /></IconButton>) : (<></>)}
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
