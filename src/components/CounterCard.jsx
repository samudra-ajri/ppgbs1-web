import { Box, Card, CardActionArea, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

function CounterCard(props) {
  const { title, size = 'medium', value = 0, isLoading, link } = props

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
      <Link to={link} component={CardActionArea}>
        <Card sx={{ padding: 1, justifyItems: 'center' }}>
          <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
            <Typography align='center' variant={fontVariant(size)} color="text.secondary">{isLoading === 'true' ? 0 : value}</Typography>
            <Typography align='center' variant="body2" color="text.secondary">{title}</Typography>
          </Box>
        </Card>
      </Link>
    </Grid>
  )
}

export default CounterCard