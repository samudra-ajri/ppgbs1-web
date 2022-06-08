import { AppBar, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'

function Header() {
  return (
    <>
      <Box sx={{ pt: 10 }}>
        <AppBar color='default'>
          <Toolbar>
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
