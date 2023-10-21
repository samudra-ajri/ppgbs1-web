import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material"
import { Link } from "react-router-dom"
import capitalize from "capitalize"
import LinearProgressWithLabel from "./LinearProgressWithLabel"
import gradeEnum from "../enums/gradeEnum"

function SumCompletionCard(props) {
  const getName = () => {
    if (props.structure === 'grade') return gradeEnum[props.title]
    return props.title
  }

  return (
    <Grid item xs={6}>
      <Card>
        <Link to='#' component={CardActionArea}>
          <CardContent>
            <Typography variant='body2' component='div'>
              {capitalize.words(getName())}
            </Typography>
            <LinearProgressWithLabel value={props.percentage} />
          </CardContent>
        </Link>
      </Card>
    </Grid>
  )
}

export default SumCompletionCard
