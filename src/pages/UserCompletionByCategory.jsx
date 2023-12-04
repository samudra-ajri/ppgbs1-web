import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import BackHeader from "../components/BackHeader"
import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material"
import { Box } from "@mui/system"
import LinearProgressWithLabel from "../components/LinearProgressWithLabel"
import SumCompletionCard from "../components/SumCompletionCard"
import {
  getSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"

function UserCompletionByCategory() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const pathnames = window.location.pathname.split("/")
  const category = pathnames[3]
  const { user } = useSelector((state) => state.auth)
  const { sumCompletions, isSuccess } = useSelector(
    (state) => state.completionScores
  )

  useEffect(() => {
    if (!user) navigate("/login")
    dispatch(
      getSumCompletions({
        structure: "subcategory",
        userId: user.id,
        category: category,
      })
    )
    dispatch(reset())
  }, [user, navigate, dispatch, category])

  const totalCategoryPercentage = () => {
    const totalCompletionCount = sumCompletions?.reduce((acc, curr) => acc + curr.completionCount, 0)
    const totalMaterialCount = sumCompletions?.reduce((acc, curr) => acc + curr.materialCount, 0)
    const totalPercentage = (totalCompletionCount / totalMaterialCount) * 100
    return Number(totalPercentage.toFixed(2))
  }

  return (
    <>
      <BackHeader title={category} />
      <Box mb={2}>
        <Typography variant='h7' component='b'>
          Total
        </Typography>
        <LinearProgressWithLabel
          value={isSuccess ? totalCategoryPercentage() : 0}
        />
      </Box>
      {!isSuccess ? (
        <Card align='center'>
          <CardContent>
            <CircularProgress size='3rem' />
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {sumCompletions.map((sumCompletion, index) => (
            <Grid item xs={6} key={index}>
              <SumCompletionCard
                key={index}
                percentage={sumCompletion.percentage}
                title={sumCompletion.subcategory}
                link={`/c/user-completion/${sumCompletion.subcategory}`}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}

export default UserCompletionByCategory
