import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ProfileCard from "../components/ProfileCard"
import { Card, CardContent, CircularProgress, Grid } from "@mui/material"
import {
  getSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import SumCompletionCard from "../components/SumCompletionCard"

function UserCompletion() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { sumCompletions, isSuccess } = useSelector(
    (state) => state.completionScores
  )

  useEffect(() => {
    if (!user) navigate("/login")
    dispatch(getSumCompletions({ structure: "category", userId: user.id }))
    dispatch(reset())
  }, [user, navigate, dispatch])

  return (
    <>
      <ProfileCard user={user} />
      {!isSuccess ? (
        <Card align='center'>
          <CardContent>
            <CircularProgress size='3rem' />
          </CardContent>
        </Card>
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
