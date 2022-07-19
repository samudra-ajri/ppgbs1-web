import { Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

function PeopleCard(props) {
  return (
    <Card variant="outlined" sx={{ mb: 0.5 }}>
      <Link to={`/`} component={CardActionArea}>
        <CardContent sx={{padding: 2,
    "&:last-child": {
      paddingBottom: 2
    }}}>
          <Grid container>
            <Grid item xs={9}>
              <Typography variant="body1">Samudra Ajri Kifli</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography align='left' variant="body2">75%</Typography>
            </Grid>
            <Grid item>
              <Typography align='right' variant="body2">X</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Link>
    </Card>
  )
}

export default PeopleCard