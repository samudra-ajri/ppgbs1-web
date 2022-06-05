import { Card, CardContent, Typography } from '@mui/material'
import LinearProgressWithLabel from './LinearProgressWithLabel'

function TargetCard() {
  return (
    <Card sx={{ mb: 1 }}>
      <CardContent>
        <Typography variant="h7" component="div">
          Alquran
        </Typography>
        <LinearProgressWithLabel value={17.5} />
      </CardContent>
    </Card>
  )
}

export default TargetCard