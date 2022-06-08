import { Card, CardContent, Grid, Typography } from '@mui/material'
import TrophyIcon from '@mui/icons-material/EmojiEventsOutlined'
import BookIcon from '@mui/icons-material/BookmarkBorderOutlined'
import LampIcon from '@mui/icons-material/LightOutlined'
import SupportIcon from '@mui/icons-material/CatchingPokemonOutlined'
import IcecreamIcon from '@mui/icons-material/IcecreamOutlined'

function StatisticsCard(props) {
  const icon = () => {
    switch (props.name) {
      case 'Total':
        return <TrophyIcon fontSize="large" color='gold' />

      case 'Alquran':
        return <BookIcon fontSize="large" color='success' />

      case 'Hadits':
        return <LampIcon fontSize="large" color='success' />

      case 'Hafalan':
        return <IcecreamIcon fontSize="large" color='secondary' />

      case 'Penunjang':
        return <SupportIcon fontSize="large" color='secondary' />

      default:
        break;
    }
  }

  return (
    <Grid item xs={props.name === 'Total' ? 12 : 6}>
      <Card>
        <CardContent>
          <Grid container>
            <Grid item align="right" xs={5}>
              {icon()}
            </Grid>
            <Grid item xs={7}>
              <Typography variant="h5" color="text.secondary">
                <b>{props.poin}</b>
              </Typography>
              <Typography variant="p" color="text.secondary">
                {props.name}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default StatisticsCard