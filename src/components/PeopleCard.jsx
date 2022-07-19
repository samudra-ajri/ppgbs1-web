import { Card, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded'
import CircleIcon from '@mui/icons-material/FiberManualRecordRounded'
import capitalize from 'capitalize'

function PeopleCard(props) {
  //F9CEEE CCF3EE
  const user = props.user

  const onClick = () => {
    console.log(123);
  }

  return (
    <Card sx={{ mb: 0.5, cursor: 'pointer' }}>
      <CardContent sx={{
        padding: 2,
        '&:last-child': {
          paddingBottom: 2
        }
      }}>
        <Grid container>
          <Grid item xs={10} md={11} onClick={onClick}>
            <Grid container>
              <Grid item>
              <Typography variant='body1'>
                {user.name}
              </Typography>
              </Grid>
              <Grid item>
              <Tooltip title={user.sex === 'male' ? 'laki-laki' : 'perempuan'}>
                <CircleIcon fontSize='small' sx={{ color: user.sex === 'male' ?' #CCF3EE' : '#F9CEEE' }} />
              </Tooltip>
              </Grid>

            </Grid>
            <Typography variant='caption' color='text.secondary'>{ capitalize.words(user.ds + ' - ' + user.klp) }</Typography>
          </Grid>
          <Grid item>
            <Tooltip title='hapus user'>
              <IconButton align='right' onClick={onClick}>
                <DeleteIcon fontSize='medium' color='error' />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PeopleCard