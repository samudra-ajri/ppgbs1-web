import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
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
import { createInitialData } from "../features/initialData/initialDataSlice"
import { toast } from "react-toastify"
import { logout } from "../features/auth/authSlice"

function PersonInputCompletion() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const pathnames = window.location.pathname.split("/")
  const category = pathnames[3]
  const subcategory = pathnames[4]
  const { person } = useSelector((state) => state.person)
  const { sumCompletions, isSuccess, isError, message } = useSelector(
    (state) => state.completionScores
  )
  const {
    isSuccess: isSuccessUpdate,
    isError: isErrorUpdate,
    messaga: messagaUpdate,
  } = useSelector((state) => state.updateCompletion)
  const [filterGrade, setFilterGrade] = useState("initial")
  const [inputs, setInputs] = useState({})

  useEffect(() => {
    if (isSuccessUpdate) toast.success("Hore! Berhasil update.")
    if (isErrorUpdate) toast.error(messagaUpdate)
    if (isError && message === "Missing authentication.") {
      dispatch(logout())
      navigate("/login")
      return
    }
    dispatch(
      getSumCompletions({
        structure: "material",
        userId: person.id,
        subcategory: subcategory,
      })
    )
    dispatch(reset())
  }, [
    person,
    navigate,
    dispatch,
    subcategory,
    isSuccessUpdate,
    isErrorUpdate,
    messagaUpdate,
    isError,
    message,
  ])

  useEffect(() => {
    if (sumCompletions) {
      const completionInputs = sumCompletions.reduce((acc, item) => {
        acc[item.materialId] = item.completionCount
        return acc
      }, {})

      dispatch(createInitialData({ completionInputs }))
      setInputs(completionInputs)
    }
  }, [dispatch, sumCompletions])

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
        structure: "material",
        userId: person.id,
        subcategory: subcategory,
        grade: grade,
      })
    )
  }

  const isQuranHaditsCategory = category === "Alquran" || category === "Hadits"
  const isPageNumber = (string) => {
    return /^\d+$/.test(string)
  }

  const cardColor = (sumCompletion) => {
    const background = inputs[sumCompletion.materialId] && "#2E7D32"
    const font = inputs[sumCompletion.materialId] && "#F0F6F0"
    return {
      background,
      font,
    }
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
          {isQuranHaditsCategory ? (
            <Typography>Halaman {category}:</Typography>
          ) : (
            <TextField
              name='grade'
              label='Filter Kelas'
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

          <Grid mt={0.1} pb={10} container spacing={2}>
            {sumCompletions.map((sumCompletion, index) => (
              <Grid
                item
                xs={
                  isQuranHaditsCategory && isPageNumber(sumCompletion.material)
                    ? 3
                    : 12
                }
                md={
                  isQuranHaditsCategory && isPageNumber(sumCompletion.material)
                    ? 2
                    : 12
                }
                key={index}
              >
                <SumCompletionCard
                  key={index}
                  percentage={sumCompletion.percentage}
                  title={sumCompletion.material}
                  link='#'
                  structure='material'
                  grade={isQuranHaditsCategory ? null : sumCompletion.grade}
                  backgroundColor={cardColor(sumCompletion).background}
                  fontColor={cardColor(sumCompletion).font}
                  disabled={true}
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
        </>
      )}
    </>
  )
}

export default PersonInputCompletion
