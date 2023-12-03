import { Card, CardActionArea, CardContent, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import LinearProgressWithLabel from "./LinearProgressWithLabel"

function SumCompletionCard(props) {
  return (
    <Card>
      <Link to={props.link} component={CardActionArea}>
        <CardContent>
          <Typography variant='body2' component='div'>
            {props.title}
          </Typography>
          <LinearProgressWithLabel value={props.percentage} />
        </CardContent>
      </Link>
    </Card>
  )
}

export default SumCompletionCard
