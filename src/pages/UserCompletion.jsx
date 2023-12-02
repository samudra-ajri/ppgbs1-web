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

function UserCompletion() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userId = window.location.pathname.split("/")[3]
  const { user } = useSelector((state) => state.auth)
  const { sumCompletions, isSuccess } = useSelector(
    (state) => state.completionScores
  )
  const [completionStructure, setCompletionStructure] = useState("category")
  const [completionGrade, setCompletionGrade] = useState("")
  const [completionSubject, setCompletionSubject] = useState("")
  const [completionCategory, setCompletionCategory] = useState("")

  useEffect(() => {
    if (!user) navigate("/login")
    dispatch(
      getSumCompletions({
        structure: completionStructure,
        userId: user.id,
        grade: completionGrade,
        subject: completionSubject,
        category: completionCategory,
      })
    )
    dispatch(reset())
  }, [
    user,
    userId,
    completionStructure,
    completionGrade,
    completionSubject,
    completionCategory,
    navigate,
    dispatch,
  ])

  const completionClickHandler = (sumCompletion) => {
    switch (completionStructure) {
      case "grade":
        setCompletionStructure("subject")
        setCompletionGrade(sumCompletion)
        break

      case "subject":
        setCompletionStructure("category")
        setCompletionSubject(sumCompletion)
        break

      case "category":
        setCompletionStructure("subcategory")
        setCompletionCategory(sumCompletion)
        break

      default:
        break
    }
  }

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
        <Grid container spacing={2}>
          {sumCompletions.map((sumCompletion, index) => (
            <Grid
              item
              xs={6}
              key={index}
              onClick={() =>
                completionClickHandler(sumCompletion[completionStructure])
              }
            >
              <SumCompletionCard
                key={index}
                percentage={sumCompletion.percentage}
                title={sumCompletion[completionStructure]}
                link='#'
                structure={completionStructure}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}

export default UserCompletion
