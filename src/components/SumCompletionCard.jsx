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
    <CardContent
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {(props.grade || props.grade === 0) && (
        <Typography
          variant='caption'
          display='block'
          gutterBottom
          sx={{
            color,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontWeight: 500,
          }}
        >
          Kelas: {gradeEnum[props.grade]}
        </Typography>
      )}

      <Typography
        variant='subtitle2'
        component='div'
        sx={{ color, fontWeight: "bold", lineHeight: 1.3, mb: 1, flexGrow: 1 }}
      >
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
        <Box sx={{ mt: "auto", pt: 1 }}>
          <LinearProgressWithLabel value={props.percentage} />
        </Box>
      )}
    </CardContent>
  )

  return (
    <Card
      variant='outlined'
      sx={{
        backgroundColor,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        boxShadow: disabled ? "none" : "0 2px 8px rgba(0,0,0,0.05)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": disabled
          ? {}
          : {
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transform: "translateY(-2px)",
            },
      }}
    >
      {disabled ? (
        <Box sx={{ height: "100%" }}>{content()}</Box>
      ) : props.onClick ? (
        <CardActionArea
          onClick={props.onClick}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          {content()}
        </CardActionArea>
      ) : (
        <CardActionArea
          component={Link}
          to={props.link}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          {content()}
        </CardActionArea>
      )}
    </Card>
  )
}

export default SumCompletionCard
