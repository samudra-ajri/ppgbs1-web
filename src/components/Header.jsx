import { AppBar, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import AdbIcon from '@mui/icons-material/Adb'

function Header() {
  return (
    <>
      <Box sx={{ pt: 10 }}>
        <AppBar color='default'>
          <Toolbar>
            <AdbIcon />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              P I G A R U
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}

export default Header
