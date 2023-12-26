import { Card, CardActionArea, CardContent, Typography } from "@mui/material"
import { Link } from "react-router-dom"

function ProfileMenuCard(props) {
  const { title, link } = props
  const cardContentStyle = {
    padding: 2,
    "&:last-child": {
      paddingBottom: 2,
    },
  }

  return (
    <Card sx={{ mb: 2 }} variant='outlined'>
      <Link to={link} component={CardActionArea}>
        <CardContent sx={cardContentStyle}>
          <Typography variant='body1'>{title}</Typography>
        </CardContent>
      </Link>
    </Card>
  )
}

export default ProfileMenuCard
