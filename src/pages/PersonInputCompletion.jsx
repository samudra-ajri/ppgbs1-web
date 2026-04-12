import {
  Box,
  Button,
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
import { useNavigate, useSearchParams } from "react-router-dom"
import BackHeader from "../components/BackHeader"
import LinearProgressWithLabel from "../components/LinearProgressWithLabel"
import SumCompletionCard from "../components/SumCompletionCard"
import {
  getSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import gradeEnum from "../enums/gradeEnum"
import { createInitialData } from "../features/initialData/initialDataSlice"
import {
  createCompletionByAdmin,
  deleteCompletionByAdmin,
  reset as resetCompletionUpdate,
} from "../features/updateCompletion/updateCompletionSlice.jsx"
import { toast } from "react-toastify"
import { logout } from "../features/auth/authSlice"

function PersonInputCompletion() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const targetMaterialMonth = searchParams.get("targetMaterialMonth")
  const targetMaterialYear = searchParams.get("targetMaterialYear")
  const targetGrade = searchParams.get("targetGrade")
  const pathnames = window.location.pathname.split("/")
  const category = pathnames[3]
  const subcategory = pathnames[4]
  const { person } = useSelector((state) => state.person)
  const { user } = useSelector((state) => state.auth)
  const { initialData } = useSelector((state) => state.initialData)
  const { sumCompletions, isSuccess, isError, message } = useSelector(
    (state) => state.completionScores,
  )
  const {
    isSuccess: isSuccessUpdate,
    isError: isErrorUpdate,
    messaga: messagaUpdate,
  } = useSelector((state) => state.updateCompletion)
  const [filterGrade, setFilterGrade] = useState("initial")
  const [inputs, setInputs] = useState({})
  const [removeInputs, setRemoveInputs] = useState({})

  // User dengan tipe GENERUS, PENGAJAR, atau ADMIN dapat input capaian
  const canInput =
    user?.currentPosition?.type === "GENERUS" ||
    user?.currentPosition?.type === "PENGAJAR" ||
    user?.currentPosition?.type === "ADMIN"

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
        targetMaterialMonth,
        targetMaterialYear,
        targetGrade,
      }),
    )
    dispatch(reset())
    dispatch(resetCompletionUpdate())
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
    targetMaterialMonth,
    targetMaterialYear,
    targetGrade,
  ])

  useEffect(() => {
    if (sumCompletions) {
      const completionInputs = sumCompletions.reduce((acc, item) => {
        acc[item.materialId] = item.completionCount
        return acc
      }, {})

      dispatch(createInitialData({ completionInputs }))
      setInputs(completionInputs)
      setRemoveInputs({})
    }
  }, [dispatch, sumCompletions])

  const totalCategoryPercentage = () => {
    const totalCompletionCount = sumCompletions?.reduce(
      (acc, curr) => acc + curr.completionCount,
      0,
    )
    const totalMaterialCount = sumCompletions?.reduce(
      (acc, curr) => acc + curr.materialCount,
      0,
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
        targetMaterialMonth,
        targetMaterialYear,
        targetGrade,
      }),
    )
  }

  const onClickInput = (completion) => {
    if (!canInput) return
    if (inputs[completion.materialId]) {
      setInputs((prevState) => ({
        ...prevState,
        [completion.materialId]: 0,
      }))
      if (initialData.completionInputs[completion.materialId])
        setRemoveInputs((prevState) => ({
          ...prevState,
          [completion.materialId]: 1,
        }))
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [completion.materialId]: 1,
      }))
      setRemoveInputs((prevState) => ({
        ...prevState,
        [completion.materialId]: 0,
      }))
    }
  }

  const selectAllInputs = () => {
    const allInputs = sumCompletions.reduce((acc, item) => {
      acc[item.materialId] = 1
      return acc
    }, {})
    setRemoveInputs({})
    setInputs(allInputs)
  }

  const resetInputs = () => {
    setRemoveInputs({})
    setInputs(initialData.completionInputs)
  }

  const saveInputs = () => {
    const newCompletions = Object.keys(inputs)
      .filter((key) => inputs[key] === 1)
      .map((key) => parseInt(key))
    if (newCompletions.length > 0) {
      dispatch(
        createCompletionByAdmin({
          userId: person.id,
          materialIds: newCompletions,
        }),
      )
    }

    const removeCompletions = Object.keys(removeInputs)
      .filter((key) => removeInputs[key] === 1)
      .map((key) => parseInt(key))
    if (removeCompletions.length > 0) {
      dispatch(
        deleteCompletionByAdmin({
          userId: person.id,
          materialIds: removeCompletions,
        }),
      )
    }
  }

  const isModified = () => {
    if (!initialData) return false
    const inputKeys = Object.keys(inputs)
    const initialDataKeys = Object.keys(initialData.completionInputs)
    if (inputKeys.length !== initialDataKeys.length) return false
    for (const key of inputKeys) {
      if (inputs[key] !== initialData.completionInputs[key]) return false
    }
    return true
  }

  const isQuranHaditsCategory = category === "Al-Quran" || category === "Hadits"
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
            !targetMaterialMonth && (
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
            )
          )}

          {canInput && (
            <Grid
              container
              spacing={1}
              direction='row'
              alignItems='center'
              mt={1}
            >
              <Grid item>
                <Button
                  sx={{ fontSize: 11 }}
                  variant='contained'
                  onClick={selectAllInputs}
                >
                  Hatam Semua
                </Button>
              </Grid>
              <Grid item xs style={{ flexGrow: 1 }}></Grid> {/* Spacer item */}
              <Grid item>
                <Button
                  disabled={isModified()}
                  sx={{ fontSize: 11 }}
                  variant='contained'
                  onClick={resetInputs}
                  color='error'
                >
                  Batal
                </Button>
              </Grid>
              <Grid item>
                <Button
                  disabled={isModified()}
                  sx={{ fontSize: 11 }}
                  variant='contained'
                  onClick={saveInputs}
                  color='success'
                >
                  Simpan
                </Button>
              </Grid>
            </Grid>
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
                sx={{ cursor: canInput ? "pointer" : "default" }}
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
