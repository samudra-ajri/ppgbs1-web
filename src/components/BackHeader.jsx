import { useSelector, useDispatch } from 'react-redux'
import { AppBar, Button, CircularProgress, IconButton, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useNavigate } from "react-router-dom"
import BackIcon from '@mui/icons-material/KeyboardBackspaceRounded'
import translate from '../helpers/translateHelper'
import capitalize from 'capitalize'
import { createCompletion } from '../features/completionDetails/completionDetailsSlice'

function BackHeader(props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const rawTitle = window.location.pathname.split('/')
  const title    = rawTitle[2]

  const { isLoading } = useSelector(
    (state) => state.completionDetails
  )

  const saveButtonText = () => {
    if (props.isModified) return <b>simpan</b>
    return 'simpan'
  }

  const saveButtonColor = () => {
    if (props.isModified) return 'primary'
    return 'inherit'
  }

  const handleClick = (e) => {
    dispatch(createCompletion({
      subjectId: props.subject._id,
      completed: props.completed
    }))
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
            <Typography component="div" sx={{ flexGrow: 1 }}>
              {capitalize.words(translate(props.title))}
            </Typography>
            <Button
              onClick={handleClick}
              disabled={!props.isModified} 
              color={saveButtonColor()}
            >
              {isLoading ? <CircularProgress size={20} /> : (title === 'details' && props.canSave ? saveButtonText() : '')}
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}

export default BackHeader
