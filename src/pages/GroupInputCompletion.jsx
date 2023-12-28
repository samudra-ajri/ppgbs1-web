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
  getGroupSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import gradeEnum from "../enums/gradeEnum"
import { toast } from "react-toastify"
import { logout } from "../features/auth/authSlice"

function GroupInputCompletion() {
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
  const { initialData } = useSelector((state) => state.initialData)
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
      getGroupSumCompletions({
        structure: "material",
        subcategory: subcategory,
        ancestorId: initialData?.groupCompletionFilters?.ancestorId,
        organizationId: initialData?.groupCompletionFilters?.organizationId,
        usersGrade: initialData?.groupCompletionFilters?.usersGrade,
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
    initialData?.groupCompletionFilters?.ancestorId,
    initialData?.groupCompletionFilters?.organizationId,
    initialData?.groupCompletionFilters?.usersGrade,
  ])

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
        ? (totalCompletionCount /
            (totalMaterialCount * sumCompletions[0].materialsMultiplier)) *
          100
        : 0
    return Number(totalPercentage.toFixed(2))
  }

  const onChangeFilter = (e) => {
    const grade = e.target.value === "initial" ? null : e.target.value
    setFilterGrade(e.target.value)
    dispatch(
      getGroupSumCompletions({
        structure: "material",
        subcategory: subcategory,
        grade: grade,
        ancestorId: initialData?.groupCompletionFilters?.ancestorId,
        organizationId: initialData?.groupCompletionFilters?.organizationId,
        usersGrade: initialData?.groupCompletionFilters?.usersGrade,
      })
    )
  }

  const isQuranHaditsCategory = category === "Al-Quran" || category === "Hadits"
  const isPageNumber = (string) => {
    return /^\d+$/.test(string)
  }

  const cardColor = (sumCompletion) => {
    const styles = [
      { threshold: 20, background: "#a31545" },
      { threshold: 30, background: "#e91e63" },
      { threshold: 40, background: "#ed4b82" },
      { threshold: 50, background: "#ffd453" },
      { threshold: 60, background: "#ffca28", font: "#212121" },
      { threshold: 70, background: "#b28d1c" },
      { threshold: 80, background: "#33ab9f" },
      { threshold: 90, background: "#009688" },
    ]

    const defaultStyle = { background: "#00695f", font: "#f0f6f0" }
    const style =
      styles.find((style) => sumCompletion.percentage < style.threshold) ||
      defaultStyle
    return { ...style, font: style.font || "#f0f6f0" }
  }

  const onClickInput = (completion) => {
    if (inputs[completion.materialId]) {
      setInputs((prevState) => ({
        ...prevState,
        [completion.materialId]: 0,
      }))
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [completion.materialId]: 1,
      }))
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
                onClick={() => onClickInput(sumCompletion)}
              >
                <SumCompletionCard
                  key={index}
                  percentage={sumCompletion.percentage}
                  title={
                    inputs[sumCompletion.materialId]
                      ? sumCompletion.percentage + "%"
                      : sumCompletion.material
                  }
                  link='#'
                  structure='material'
                  grade={isQuranHaditsCategory ? null : sumCompletion.grade}
                  backgroundColor={cardColor(sumCompletion).background}
                  fontColor={cardColor(sumCompletion).font}
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

export default GroupInputCompletion
