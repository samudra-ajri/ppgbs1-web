import { AppBar, Toolbar, Typography } from "@mui/material"

function Header() {
  return (
    <>
      <AppBar color='default'>
        <Toolbar>
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1 }}
            translate='no'
          >
            P I G A R U
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
