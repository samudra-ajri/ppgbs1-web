import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material"
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
      <Typography variant='body1' component='div' sx={{ color }}>
        {props.title}
      </Typography>
      {props.totalTarget !== undefined && (
        <Box
          sx={{
            display: "inline-block",
            bgcolor: props.totalTarget > 0 ? "#2E7D32" : "#BDBDBD",
            color: "#fff",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            mt: 1,
          }}
        >
          <Typography variant='caption' fontWeight='bold'>
            Total {props.totalTarget} target
          </Typography>
        </Box>
      )}
      {props.structure !== "material" && (
        <LinearProgressWithLabel value={props.percentage} />
      )}
    </CardContent>
  )
  return (
    <Card variant='outlined' sx={{ backgroundColor }}>
      {disabled ? (
        content()
      ) : props.onClick ? (
        <CardActionArea onClick={props.onClick}>{content()}</CardActionArea>
      ) : (
        <Link to={props.link} component={CardActionArea}>
          {content()}
        </Link>
      )}
    </Card>
  )
}

export default SumCompletionCard
