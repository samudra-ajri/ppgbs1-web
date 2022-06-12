import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useNavigate } from "react-router-dom"
import BackIcon from '@mui/icons-material/KeyboardBackspaceRounded';

function BackHeader() {
  const navigate = useNavigate()
  return (
    <>
      <Box sx={{ pt: 10 }}>
        <AppBar color='default'>
          <Toolbar>
            <IconButton aria-label="delete" onClick={() => navigate(-1)} >
              <BackIcon fontSize='large'/>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}

export default BackHeader
