import { Card, CardContent, Typography } from '@mui/material'
import capitalize from 'capitalize'

function ProfileCard(props) {
  const adminLabel = () => {
    if (props.user.role === 'ADMIN') return props.user.role
  }

  const muballighLabel = () => {
    if (props.user.isMuballigh) return 'Muballigh'
  }
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          { props.user.name }
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          { props.user.phone ? props.user.phone : props.user.email }
        </Typography>
        <Typography sx={{ fontSize: 12 }} color="text.secondary">
          { capitalize.words(props.user.ds + ' - ' + props.user.klp) }
        </Typography>
        <Typography sx={{ fontSize: 12 }} color="text.secondary">
          { muballighLabel() }
        </Typography>
        <Typography sx={{ fontSize: 12 }} color="text.secondary">
          { adminLabel() }
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ProfileCard