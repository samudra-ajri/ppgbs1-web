import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Typography,
} from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import CloseIcon from "@mui/icons-material/Close"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import BackHeader from "../components/BackHeader"
import LinearProgressWithLabel from "../components/LinearProgressWithLabel"
import SumCompletionCard from "../components/SumCompletionCard"
import {
  getSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import gradeEnum from "../enums/gradeEnum"

function InputCompletion() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const pathnames = window.location.pathname.split("/")
  const subcategory = pathnames[3]
  const { user } = useSelector((state) => state.auth)
  const { sumCompletions, isSuccess } = useSelector(
    (state) => state.completionScores
  )

  useEffect(() => {
    if (!user) navigate("/login")
    dispatch(
      getSumCompletions({
        structure: "material",
        userId: user.id,
        subcategory: subcategory,
      })
    )
    dispatch(reset())
  }, [user, navigate, dispatch, subcategory])

  const totalCategoryPercentage = () => {
    const totalCompletionCount = sumCompletions?.reduce(
      (acc, curr) => acc + curr.completionCount,
      0
    )
    const totalMaterialCount = sumCompletions?.reduce(
      (acc, curr) => acc + curr.materialCount,
      0
    )
    const totalPercentage = (totalCompletionCount / totalMaterialCount) * 100
    return Number(totalPercentage.toFixed(2))
  }

  return (
    <>
      <BackHeader title={subcategory.replace(/%20/g, " ")} />
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
        <>
          <Button
            size='small'
            variant='contained'
            color='inherit'
            startIcon={<FilterListIcon />}
          >
            Filter
          </Button>

          <Drawer anchor='left' open={true} onClose={() => {}}>
            <Box
              sx={{ width: 300, padding: 3 }}
              role='presentation'
              onClick={() => {}}
              onKeyDown={() => {}}
            >
              <IconButton aria-label='close'>
                <CloseIcon />
              </IconButton>
              <Typography align='center'>
                <b>Filter</b>
              </Typography>
              <Typography mt={2} mb={1}>
                Kelas
              </Typography>
              {Object.keys(gradeEnum).map((grade) => (
                <Chip
                  variant='outlined'
                  key={grade}
                  label={
                    <Typography sx={{ fontSize: 12 }}>
                      {gradeEnum[grade]}
                    </Typography>
                  }
                  name={grade}
                  onClick={() => {}}
                  sx={{ ml: 0, mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          </Drawer>

          <Grid mt={0.1} container spacing={2}>
            {sumCompletions.map((sumCompletion, index) => (
              <Grid item xs={12} key={index}>
                <SumCompletionCard
                  key={index}
                  percentage={sumCompletion.percentage}
                  title={sumCompletion.material}
                  link='#'
                  structure='material'
                  grade={sumCompletion.grade}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  )
}

export default InputCompletion
