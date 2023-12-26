import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ProfileCard from "../components/ProfileCard"
import { Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material"
import {
  getSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import SumCompletionCard from "../components/SumCompletionCard"
import { logout } from "../features/auth/authSlice"

function UserCompletion() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { sumCompletions, isSuccess, isError, message } = useSelector(
    (state) => state.completionScores
  )

  useEffect(() => {
    if (!user) navigate("/login")
    if (isError && message === "Missing authentication.") {
      dispatch(logout())
      navigate("/login")
      return
    }
    dispatch(getSumCompletions({ structure: "category", userId: user.id }))
    dispatch(reset())
  }, [user, isError, navigate, dispatch, message])

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Capaian Materi
      </Typography>

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
                link={`/c/user-completion/${sumCompletion.category}`}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}

export default UserCompletion
