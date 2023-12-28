import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import BackHeader from "../components/BackHeader"
import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material"
import { Box } from "@mui/system"
import LinearProgressWithLabel from "../components/LinearProgressWithLabel"
import SumCompletionCard from "../components/SumCompletionCard"
import {
  getSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import gradeEnum from "../enums/gradeEnum"
import { logout } from "../features/auth/authSlice"

function UserCompletionByCategory() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const pathnames = window.location.pathname.split("/")
  const category = pathnames[3]
  const { user } = useSelector((state) => state.auth)
  const { sumCompletions, isSuccess, isError, message } = useSelector(
    (state) => state.completionScores
  )

  const [filterGrade, setFilterGrade] = useState("initial")

  useEffect(() => {
    if (!user) navigate("/login")
    if (isError && message === "Missing authentication.") {
      dispatch(logout())
      navigate("/login")
      return
    }
    dispatch(
      getSumCompletions({
        structure: "subcategory",
        userId: user.id,
        category: category,
      })
    )
    dispatch(reset())
  }, [user, navigate, dispatch, category, isError, message])

  const totalCategoryPercentage = () => {
    const totalCompletionCount = sumCompletions?.reduce(
      (acc, curr) => acc + curr.completionCount,
      0
    )
    const totalMaterialCount = sumCompletions?.reduce(
      (acc, curr) => acc + curr.materialCount,
      0
    )
    const totalPercentage =
      totalCompletionCount && totalMaterialCount
        ? (totalCompletionCount / totalMaterialCount) * 100
        : 0
    return Number(totalPercentage.toFixed(2))
  }

  const onChangeFilter = (e) => {
    const grade = e.target.value === "initial" ? null : e.target.value
    setFilterGrade(e.target.value)
    dispatch(
      getSumCompletions({
        structure: "subcategory",
        userId: user.id,
        category: category,
        grade: grade,
      })
    )
  }

  const isQuranHaditsCategory = category === "Al-Quran" || category === "Hadits"

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

      {isQuranHaditsCategory && (
        <TextField
          name='grade'
          label='Filter Materi Kelas'
          value={filterGrade}
          onChange={onChangeFilter}
          variant='outlined'
          align='left'
          size='small'
          select
          fullWidth
        >
          <MenuItem key='initial' value='initial'>
            Semua Kelas
          </MenuItem>
          {Object.keys(gradeEnum).map((option) => (
            <MenuItem key={option} value={option}>
              {gradeEnum[option]}
            </MenuItem>
          ))}
        </TextField>
      )}

      {!isSuccess ? (
        <Card align='center'>
          <CardContent>
            <CircularProgress size='3rem' />
          </CardContent>
        </Card>
      ) : (
        <Grid container pb={10} spacing={2} mt={1}>
          {sumCompletions.map((sumCompletion, index) => (
            <Grid item xs={6} key={index}>
              <SumCompletionCard
                key={index}
                percentage={sumCompletion.percentage}
                title={sumCompletion.subcategory}
                link={`/c/detail-completion/${category}/${sumCompletion.subcategory}`}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            {sumCompletions?.length === 0 && (
              <Typography align='center' variant='body2'>
                Tidak ada target materi pada kelas ini.
              </Typography>
            )}
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default UserCompletionByCategory
