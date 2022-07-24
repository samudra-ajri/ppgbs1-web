import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import capitalize from 'capitalize'
import { Link } from 'react-router-dom'
import LinearProgressWithLabel from './LinearProgressWithLabel'

function TargetCard(props) {
  const userId          = props.userId
  const subject         = props.subject
  const completionPoin  = props.completion?.poin ?? 0
  const targetPoin      = props.subject.totalPoin
  const poin            = completionPoin / targetPoin * 100

  const generatePath = () => {
    if (userId) return `/c/details/${subject._id}/${userId}`
    return `/c/details/${subject._id}`
  }

  return (
    <Card sx={{ mb: 1 }}>
      <Link to={generatePath()} component={CardActionArea}>
        <CardContent>
          <Typography variant="h7" component="div">
            {capitalize.words(subject.name)}
          </Typography>
          <LinearProgressWithLabel value={poin} />
        </CardContent>
      </Link>
    </Card>
  )
}

export default TargetCard