import { Box, Card, Grid, Typography } from '@mui/material'

function CounterCard(props) {
  const { title, size = 'medium', value = 0 } = props
  
  const sizeStyle = (size) => {
    if (size === 'small') return 4
    if (size === 'medium') return 6
    return 12
  }

  const fontVariant = (size) => {
    if (size === 'large') return 'h4'
    if (size === 'medium') return 'h5'
    return 'h6'
  }

  return (
    <Grid item xs={sizeStyle(size)}>
      <Card sx={{ padding: 1, justifyItems: 'center' }}>
        <Box sx={{ position: 'relative' }}>
          <Typography align='center' variant={fontVariant(size)} color="text.secondary">{value}</Typography>
          <Typography align='center' variant="body2" color="text.secondary">{title}</Typography>
        </Box>
      </Card>
    </Grid>
  )
}

export default CounterCard