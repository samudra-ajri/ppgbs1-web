import { Card, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded'
import capitalize from 'capitalize'

function PeopleCard(props) {
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
            </Grid>
            <Typography fontSize={10} component='p' color='text.secondary'>{ capitalize.words(user.ds + ', ' + user.klp) }</Typography>
            <Typography fontSize={10} component='p' color='text.secondary'>{ user.sex === 'male' ? 'Laki-laki' : 'Perempuan' }</Typography>
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