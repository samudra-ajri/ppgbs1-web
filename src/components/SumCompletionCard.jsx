import { Card, CardActionArea, CardContent, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import LinearProgressWithLabel from "./LinearProgressWithLabel"
import gradeEnum from "../enums/gradeEnum"

function SumCompletionCard(props) {
  return (
    <Card>
      <Link to={props.link} component={CardActionArea}>
        <CardContent>
          {(props.grade || props.grade === 0) && (
            <Typography variant='caption' display='block' gutterBottom>
              kelas: {gradeEnum[props.grade]}
            </Typography>
          )}
          <Typography variant='body2' component='div'>
            {props.title}
          </Typography>
          {props.structure !== "material" && (
            <LinearProgressWithLabel value={props.percentage} />
          )}
        </CardContent>
      </Link>
    </Card>
  )
}

export default SumCompletionCard
