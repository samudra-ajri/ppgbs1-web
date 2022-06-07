import { Card, CardContent, Typography } from '@mui/material'
import capitalize from 'capitalize'
import LinearProgressWithLabel from './LinearProgressWithLabel'

function TargetCard(props) {
  const poin = props.subject.totalPoin/props.subject.totalPoin*100
  return (
    <Card sx={{ mb: 1 }}>
      <CardContent>
        <Typography variant="h7" component="div">
          {capitalize.words(props.subject.name)}
        </Typography>
        <LinearProgressWithLabel value={poin} />
      </CardContent>
    </Card>
  )
}

export default TargetCard