import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import capitalize from 'capitalize'
import { Link } from 'react-router-dom'
import LinearProgressWithLabel from './LinearProgressWithLabel'

function TargetCard(props) {
  const completionPoin  = props.completion?.poin ?? 0
  const targetPoin      = props.subject.totalPoin
  const poin            = completionPoin / targetPoin * 100

  return (
    <Card sx={{ mb: 1 }}>
      <Link to={`/c/details/${props.subject._id}`} component={CardActionArea}>
        <CardContent>
          <Typography variant="h7" component="div">
            {capitalize.words(props.subject.name)}
          </Typography>
          <LinearProgressWithLabel value={poin} />
        </CardContent>
      </Link>
    </Card>
  )
}

export default TargetCard