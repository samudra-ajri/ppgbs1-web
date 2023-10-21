import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material"
import { Link } from "react-router-dom"
import LinearProgressWithLabel from "./LinearProgressWithLabel"
import gradeEnum from "../enums/gradeEnum"

function SumCompletionCard(props) {
  const getName = () => {
    if (props.structure === "grade") return gradeEnum[props.title]
    return props.title
  }

  return (
    <Card>
      <Link to='#' component={CardActionArea}>
        <CardContent>
          <Typography variant='body2' component='div'>
            {getName()}
          </Typography>
          <LinearProgressWithLabel value={props.percentage} />
        </CardContent>
      </Link>
    </Card>
  )
}

export default SumCompletionCard
