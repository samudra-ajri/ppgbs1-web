import PropTypes from 'prop-types'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Card, CardActionArea, Grid } from '@mui/material'
import { Link } from 'react-router-dom'

function CircularProgressWithLabel(props) {
  const { value, title, isloading, link, sizePosition } = props

  const color = () => {
    if (value < 50) return 'inherit'
    if (value < 75) return 'secondary'
    return 'success'
  }

  const size = () => {
    if (sizePosition === 'top') return 120
    return 100
  }

  return (
    <Grid item xs={sizePosition === 'top' ? 12 : 6}>
        <Link to={link} component={CardActionArea}>
      <Card sx={{ padding: 1, justifyItems: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress color={color()} size={size()} variant="determinate" value={isloading === 'true' ? 0 : value} />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography align='center' variant="caption" color="text.secondary">
                {isloading === 'true' ? (
                  <Grid align="center">
                    <CircularProgress size={15} />
                  </Grid>
                ) : (
                  <b>{`${Math.round(value)}%`}<br /></b>
                )}
                {title}
              </Typography>
            </Box>
          </Box>
      </Card>
        </Link>
    </Grid>
  )
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
}

export default CircularProgressWithLabel