import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useNavigate } from "react-router-dom"
import BackIcon from '@mui/icons-material/KeyboardBackspaceRounded'
import translate from '../helpers/translateHelper'
import capitalize from 'capitalize'

function BackHeader(props) {
  const navigate = useNavigate()
  const rawTitle = window.location.pathname.split('/')
  const title = rawTitle[2]

  const saveButtonText = () => {
    if (props.isModified) return <b>simpan</b>
    return 'simpan'
  }

  const saveButtonColor = () => {
    if (props.isModified) return 'primary'
    return 'inherit'
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar color='default'>
          <Toolbar>
            <IconButton
              aria-label="back"
              onClick={() => navigate(-1)}
              sx={{ mr: 2 }}
            >
              <BackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <b>{capitalize.words(translate(props.title))}</b>
            </Typography>
            <Button color={saveButtonColor()}>{title === 'details' ? saveButtonText() : ''}</Button>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}

export default BackHeader
