import { Card, CardActionArea, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded'
import capitalize from 'capitalize'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUser } from '../features/users/userSlice'

function PeopleCard(props) {
  const dispatch = useDispatch()
  const user = props.user
  const age = moment(user.birthdate).fromNow().split(' ')[0]
  const { isLoading } = useSelector((state) => state.users)

  const onClick = () => {
    dispatch(deleteUser(user._id))
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
          <Grid item xs={10} md={11}>
            <Link to={`/c/profile/${user._id}`} component={CardActionArea}>
              <Grid container>
                <Grid item>
                  <Typography variant='body1'>
                    {user.name}
                  </Typography>
                </Grid>
              </Grid>
              <Typography fontSize={10} component='p' color='text.secondary'>{capitalize.words(user.ds + ', ' + user.klp)}</Typography>
              <Typography fontSize={10} component='p' color='text.secondary'>{(user.sex === 'male, ' ? 'Laki-laki' : 'Perempuan, ') + age + ' thn'}</Typography>
            </Link>
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