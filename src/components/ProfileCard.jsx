import { useSelector } from 'react-redux'
import { Card, CardContent, Typography } from '@mui/material'
import capitalize from 'capitalize'

function ProfileCard() {
  const { user } = useSelector((state) => state.auth)

  const adminLabel = () => {
    if (user.role === 'ADMIN') return user.role
  }

  const muballighLabel = () => {
    if (user.isMuballigh) return 'Muballigh'
  }
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          { user.name }
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          { user.phone ? user.phone : user.email }
        </Typography>
        <Typography sx={{ fontSize: 12 }} color="text.secondary">
          { capitalize.words(user.ds + ' - ' + user.klp) }
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