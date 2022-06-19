import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useNavigate } from "react-router-dom"
import BackIcon from '@mui/icons-material/KeyboardBackspaceRounded'
import translate from '../helpers/translateHelper'
import capitalize from 'capitalize'

function BackHeader(props) {
  const navigate = useNavigate()
  const rawTitle = window.location.pathname.split('/')
  const title = rawTitle[2]

  return (
    <>
      <Box sx={{ flexGrow: 1, pb: 10 }}>
        <AppBar color='default'>
          <Toolbar>
            <IconButton
              aria-label="back"
              onClick={() => navigate(-1)}
            >
              <BackIcon />
            </IconButton>
            <Typography align="center" variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <b>{capitalize.words(translate(props.title))}</b>
            </Typography>
            <Typography color="text.secondary">
              {title === 'details' ? 'simpan' : ''}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}

export default BackHeader
