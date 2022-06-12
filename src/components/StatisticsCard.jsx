import { Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material'
import TrophyIcon from '@mui/icons-material/EmojiEventsOutlined'
import BookIcon from '@mui/icons-material/BookmarkBorderOutlined'
import LampIcon from '@mui/icons-material/LightOutlined'
import SupportIcon from '@mui/icons-material/CatchingPokemonOutlined'
import IcecreamIcon from '@mui/icons-material/IcecreamOutlined'
import { Link } from 'react-router-dom'
import translate from '../helpers/translateHelper'
import capitalize from 'capitalize'

function StatisticsCard(props) {
  const icon = () => {
    switch (props.name) {
      case 'Total':
        return <TrophyIcon fontSize="large" color='gold' />

      case 'Alquran':
        return <BookIcon fontSize="large" color='success' />

      case 'Hadits':
        return <LampIcon fontSize="large" color='success' />

      case 'Rote':
        return <IcecreamIcon fontSize="large" color='secondary' />

      case 'Extra':
        return <SupportIcon fontSize="large" color='secondary' />

      default:
        break;
    }
  }

  return (
    <Grid item xs={props.name === 'Total' ? 12 : 6}>
      <Card>
      <Link to={props.name === 'Total' ? '/profile' : `/c/targets/${props.name.toLowerCase()}`} component={CardActionArea}>
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
                {capitalize(translate(props.name.toLowerCase()))}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        </Link>
      </Card>
    </Grid>
  )
}

export default StatisticsCard