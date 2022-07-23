import { Card, CardContent, Typography } from '@mui/material'
import capitalize from 'capitalize'

function ProfileCard(props) {
  const user = props.user

  const adminLabel = () => {
    if (user.role === 'ADMIN') return user.role
  }

  const muballighLabel = () => {
    if (user.isMuballigh) return 'Muballigh'
  }
  
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          { user.name }
        </Typography>
        <Typography variant='body2' color="text.secondary" gutterBottom>
          { user.phone ? user.phone : user.email }
        </Typography>
        <Typography variant='body2' color="text.secondary">
          { capitalize.words(user.ds + ' - ' + user.klp) }
        </Typography>
        <Typography variant='body2' color="text.secondary">
          { muballighLabel() }
        </Typography>
        <Typography variant='body2' color="text.secondary">
          { adminLabel() }
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ProfileCard