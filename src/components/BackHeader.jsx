import { AppBar, Grid, IconButton, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useNavigate } from "react-router-dom"
import BackIcon from '@mui/icons-material/KeyboardBackspaceRounded'
import translate from '../helpers/translateHelper'
import capitalize from 'capitalize'

function BackHeader(props) {
  const navigate = useNavigate()
  return (
    <>
      <Box sx={{ pt: 10 }}>
        <AppBar color='default'>
          <Toolbar>
            <Grid container>
              <Grid item xs={2} sm={1}>
                <IconButton aria-label="back" onClick={() => navigate(-1)} >
                  <BackIcon fontSize='large' />
                </IconButton>
              </Grid>
              <Grid item align="center" pt={2} xs={8} sm={10}>
                <Typography color="text.secondary"><b>{capitalize.words(translate(props.title))}</b></Typography>
              </Grid>
              <Grid item align="right" pt={2}>
                <Typography color="text.secondary">
                  simpan
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}

export default BackHeader
