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
import moment from "moment"

function UserCompletion() {
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

  const lastUpdateTime = () => {
    const lastCompletionUpdate = person?.lastCompletionUpdate
    if (lastCompletionUpdate) {
      const startDateObject = moment(new Date(Number(lastCompletionUpdate)))
      const startDate = startDateObject.format("DD MMM YYYY")
      const startTime = startDateObject.format("HH.mm")
      return `${startDate} pkl. ${startTime}`
    }
    return "-"
  }

  return (
    <>
      <ProfileCard user={person} />
      {!isSuccess ? (
        <Grid pb={10}>
          <Card align='center'>
            <CardContent>
              <CircularProgress size='3rem' />
            </CardContent>
          </Card>
        </Grid>
      ) : (
        <>
          <Grid container pt={2} pb={2}>
            <Grid item>
              <Typography
                align='center'
                color='text.secondary'
                fontSize={12}
                variant='subtitle2'
              >
                Update terakhir pada: {lastUpdateTime()}
              </Typography>
            </Grid>
          </Grid>
          <Grid container pb={10} spacing={2}>
            {sumCompletions.map((sumCompletion, index) => (
              <Grid item xs={6} key={index}>
                <SumCompletionCard
                  key={index}
                  percentage={sumCompletion.percentage}
                  title={sumCompletion.category}
                  link={`/c/person-completion/${sumCompletion.category}`}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  )
}

export default UserCompletion
