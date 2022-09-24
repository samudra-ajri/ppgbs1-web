import { Card, CardContent, Grid, IconButton, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import capitalize from 'capitalize'
import moment from 'moment'
import { useNavigate } from 'react-router-dom';

function ProfileCard(props) {
  const navigate = useNavigate()

  const user = props.user
  const age = moment(user?.birthdate).fromNow().split(' ')[0]

  const muballighLabel = () => {
    if (user?.role === 'MT') return 'Muballigh Tugasan'
    if (user?.role === 'MS') return 'Muballigh Setempat'
  }

  const maritalStatus = () => {
    if (user?.isMarried) return 'sudah menikah'
    return 'lajang'
  }

  const onClick = () => {
    navigate('/profile/edit')
  }

  return (
    <>

      <Card sx={{ marginBottom: 2, justifyItems: 'center' }}>
        <CardContent>
          <Grid container>
            <Grid item xs={10} md={11}>
              <Typography variant="h5" component="div">
                {user?.name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {user?.phone ? user?.phone : user?.email}
              </Typography>
              <Typography variant="body2">
                {capitalize.words(user?.ds + ', ' + user?.klp)}
                <br />
                {(user?.sex === 'male' ? 'Laki-laki' : 'Perempuan') + `${user?.role === 'GENERUS' ? ', ' + age + ' tahun' : ', ' + maritalStatus()}`}
                <br />
              </Typography>
              <Typography variant="body2">
                {user?.role !== 'GENERUS' && `Asal: ${user?.hometown}`}
              </Typography>
            </Grid>
            <Grid item>
                <IconButton align='right' onClick={onClick}>
                  <EditIcon fontSize='medium'/>
                </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {(user?.role === 'MT' || user?.role === 'MS') &&
        <>
          <Card sx={{ marginBottom: 2, justifyItems: 'center' }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Kemuballighan
              </Typography>
              <Typography variant="h6" component="div">
                {muballighLabel()}
              </Typography>
              <Typography variant="body2">
                {`Tahun lulus Kertosono: ${user?.kertosonoYear}`}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ marginBottom: 2, justifyItems: 'center' }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Pendidikan
              </Typography>
              <Typography variant="body2">
                {`Asal pondok: ${capitalize.words(user?.pondok)}`}
                <br />
                {`Pendidikan formal: ${capitalize.words(user?.education)}`}
                <br />
                <br />
                Hadits besar:
                <br />
                {
                  user?.greatHadiths?.length !== 0
                    ? user?.greatHadiths.map(hadith => (
                      <>- {hadith} <br /></>
                    ))
                    : '-'
                }
              </Typography>
            </CardContent>
          </Card>
        </>
      }
    </>
  )
}

export default ProfileCard