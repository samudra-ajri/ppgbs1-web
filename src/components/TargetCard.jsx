import { Card, CardContent, Grid, Typography } from '@mui/material'
import capitalize from 'capitalize'
import LinearProgressWithLabel from './LinearProgressWithLabel'

function TargetCard(props) {
  const completionPoin = props.completion ? props.completion.poin : 0
  const targetPoin = props.subject.totalPoin
  const poin = completionPoin / targetPoin * 100

  return (
    <Grid item xs={12}>
      <Card sx={{ mb: 1 }}>
        <CardContent>
          <Typography variant="h7" component="div">
            {capitalize.words(props.subject.name)}
          </Typography>
          <LinearProgressWithLabel value={poin} />
        </CardContent>
      </Card>
    </Grid>
  )
}

export default TargetCard