import { useEffect, useState } from "react"
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

function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userId = window.location.pathname.split("/")[3]
  const { user } = useSelector((state) => state.auth)
  const { sumCompletions, isSuccess } = useSelector(
    (state) => state.completionScores
  )
  const [completionStructure, setCompletionStructure] = useState("grade")

  useEffect(() => {
    if (!user) navigate("/login")
    dispatch(getSumCompletions({ structure: "grade", userId: user.id }))
    dispatch(reset())
  }, [user, userId, navigate, dispatch])

  return (
    <>
      <ProfileCard user={user} />
      <Typography variant='body'>Capaian Materi</Typography>
      {!isSuccess ? (
        <Card align='center'>
          <CardContent>
            <CircularProgress size='3rem' />
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={1} sx={{ mt: 1, mb: 1 }}>
          {sumCompletions.map((sumCompletion, index) => (
            <SumCompletionCard
              key={index}
              percentage={sumCompletion.percentage}
              title={sumCompletion[completionStructure]}
              link='#'
              structure={completionStructure}
            />
          ))}
        </Grid>
      )}
    </>
  )
}

export default Profile
