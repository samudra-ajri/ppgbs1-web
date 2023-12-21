import { Card, CardActionArea, CardContent, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import LinearProgressWithLabel from "./LinearProgressWithLabel"
import gradeEnum from "../enums/gradeEnum"

function SumCompletionCard(props) {
  const { disabled } = props
  const backgroundColor = props.backgroundColor ? props.backgroundColor : ""
  const color = props.fontColor ? props.fontColor : ""

  const content = () => (
    <CardContent>
      {(props.grade || props.grade === 0) && (
        <Typography
          variant='caption'
          display='block'
          gutterBottom
          sx={{ color }}
        >
          Kelas: {gradeEnum[props.grade]}
        </Typography>
      )}
      <Typography variant='body2' component='div' sx={{ color }}>
        {props.title}
      </Typography>
      {props.structure !== "material" && (
        <LinearProgressWithLabel value={props.percentage} />
      )}
    </CardContent>
  )
  return (
    <Card sx={{ backgroundColor }}>
      {disabled ? (
        content()
      ) : (
        <Link to={props.link} component={CardActionArea}>
          {content()}
        </Link>
      )}
    </Card>
  )
}

export default SumCompletionCard
