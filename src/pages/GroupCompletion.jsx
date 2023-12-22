import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ProfileCard from "../components/ProfileCard"
import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material"
import {
  getSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import SumCompletionCard from "../components/SumCompletionCard"
import { logout } from "../features/auth/authSlice"

function GroupCompletion() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { person } = useSelector((state) => state.person)
  const { sumCompletions, isSuccess, isError, message } = useSelector(
    (state) => state.completionScores
  )

  useEffect(() => {
    if (isError && message === "Missing authentication.") {
      dispatch(logout())
      navigate("/login")
      return
    }
    dispatch(getSumCompletions({ structure: "category", userId: person?.id }))
    dispatch(reset())
  }, [person, isError, navigate, dispatch, message])

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>
        Capaian Materi
      </Typography>

      <Card sx={{ mb: 0.5 }} align='center'>
        <CardContent
          sx={{
            padding: 2,
            "&:last-child": {
              paddingBottom: 2,
            },
          }}
        >
          <Typography variant='body1'>Jumlah</Typography>
          <Typography variant='h5'>750</Typography>
          <Typography variant='body2'>Generus</Typography>
        </CardContent>
      </Card>

      {!isSuccess ? (
        <Grid pb={10}>
          <Card align='center'>
            <CardContent>
              <CircularProgress size='3rem' />
            </CardContent>
          </Card>
        </Grid>
      ) : (
        <Grid container pb={10} spacing={2}>
          {sumCompletions.map((sumCompletion, index) => (
            <Grid item xs={6} key={index}>
              <SumCompletionCard
                key={index}
                percentage={sumCompletion.percentage}
                title={sumCompletion.category}
                link={`/c/group-completion/${sumCompletion.category}`}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}

export default GroupCompletion
