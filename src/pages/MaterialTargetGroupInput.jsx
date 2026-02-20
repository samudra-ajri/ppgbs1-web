import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import BackHeader from "../components/BackHeader"
import SumCompletionCard from "../components/SumCompletionCard"
import {
  createMaterialTargets,
  deleteMaterialTargets,
  getGroupTargetsSummaryMaterial,
  reset,
} from "../features/materialTargets/materialTargetSlice"
import { logout } from "../features/auth/authSlice"
import { getppd } from "../features/organizations/organizationSlice"
import { toast } from "react-toastify"

function MaterialTargetGroupInput() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const targetMaterialMonth = searchParams.get("targetMaterialMonth")
  const targetMaterialYear = searchParams.get("targetMaterialYear")
  const targetGrade = searchParams.get("targetGrade")

  const pathnames = window.location.pathname.split("/")
  // Path: /c/material-target/detail/:category/:subcategory
  const category = decodeURIComponent(pathnames[4])
  const subcategory = decodeURIComponent(pathnames[5])

  const { groupTargetsSummaryMaterial, isSuccess, isError, message } =
    useSelector((state) => state.materialTargets)
  const { user } = useSelector((state) => state.auth)
  const { ppd: ppdList } = useSelector((state) => state.organizations)

  const [inputs, setInputs] = useState({})
  const [initialInputs, setInitialInputs] = useState({})

  const isPPG = user?.currentPosition?.organizationLevel === 0
  const isPPDOrTeacher =
    user?.currentPosition?.organizationLevel === 1 ||
    user?.currentPosition?.type === "PENGAJAR"

  const initialAncestorIdFilter = () => {
    const isPPD = user?.currentPosition?.organizationLevel === 1
    if (!isPPDOrTeacher) return ""
    if (isPPD) return user.currentPosition.organizationId
    return user.currentPosition.organizationAncestorId
  }

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    if (isError && message === "Missing authentication.") {
      dispatch(logout())
      navigate("/login")
      return
    }
    if (!ppdList && isPPG) dispatch(getppd())

    dispatch(
      getGroupTargetsSummaryMaterial({
        subcategory,
        month: targetMaterialMonth,
        year: targetMaterialYear,
        grades: targetGrade,
      }),
    )
  }, [
    navigate,
    dispatch,
    subcategory,
    isError,
    message,
    targetMaterialMonth,
    targetMaterialYear,
    targetGrade,
    ppdList,
    isPPG,
    user,
  ])

  useEffect(() => {
    if (groupTargetsSummaryMaterial && groupTargetsSummaryMaterial.length > 0) {
      const newInputs = {}
      groupTargetsSummaryMaterial.forEach((item) => {
        // Assume API returns targetedCount > 0 if targeted
        // Or we might need materialId. Let's assume item.materialId exists.
        if (item.materialId) {
          newInputs[item.materialId] = item.targetedCount > 0 ? 1 : 0
        }
      })
      setInputs(newInputs)
      setInitialInputs(newInputs)
    }
  }, [groupTargetsSummaryMaterial])

  const isQuranHaditsCategory = category === "Al-Quran" || category === "Hadits"
  const isPageNumber = (string) => {
    return /^\d+$/.test(string)
  }

  const cardColor = (sumCompletion) => {
    // Check local inputs state first
    const isTargeted =
      inputs[sumCompletion.materialId] !== undefined
        ? inputs[sumCompletion.materialId] === 1
        : sumCompletion.targetedCount > 0

    const background = isTargeted ? "#2E7D32" : undefined
    const font = isTargeted ? "#F0F6F0" : undefined
    return {
      background,
      font,
    }
  }

  const onClickInput = (completion) => {
    if (!completion.materialId) return
    setInputs((prev) => ({
      ...prev,
      [completion.materialId]: prev[completion.materialId] === 1 ? 0 : 1,
    }))
  }

  const selectAllInputs = () => {
    const newInputs = { ...inputs }
    Object.keys(newInputs).forEach((key) => {
      newInputs[key] = 1
    })
    setInputs(newInputs)
  }

  const resetInputs = () => {
    setInputs(initialInputs)
  }

  const isModified = () => {
    const keys = Object.keys(inputs)
    if (keys.length === 0 && Object.keys(initialInputs).length === 0)
      return false
    for (const key of keys) {
      if (inputs[key] !== initialInputs[key]) return true
    }
    return false
  }

  const saveInputs = async () => {
    const grades = targetGrade
      ? targetGrade.split(",").map((g) => parseInt(g))
      : []
    const month = parseInt(targetMaterialMonth)
    const year = parseInt(targetMaterialYear)

    const addedIds = Object.keys(inputs)
      .filter(
        (key) =>
          inputs[key] === 1 &&
          (!initialInputs[key] || initialInputs[key] === 0),
      )
      .map((key) => parseInt(key))

    const removedIds = Object.keys(inputs)
      .filter((key) => inputs[key] === 0 && initialInputs[key] === 1)
      .map((key) => parseInt(key))

    let success = true
    let errorMsg = ""

    if (addedIds.length > 0) {
      const data = {
        materialIds: addedIds,
        grades,
        month,
        year,
      }
      const result = await dispatch(createMaterialTargets(data))
      if (!createMaterialTargets.fulfilled.match(result)) {
        success = false
        errorMsg += "Gagal menambah: " + result.payload + ". "
      }
    }

    if (removedIds.length > 0) {
      const params = {
        materialIds: removedIds.join(","),
        grades: grades.join(","),
        month,
        year,
      }
      const result = await dispatch(deleteMaterialTargets(params))
      if (!deleteMaterialTargets.fulfilled.match(result)) {
        success = false
        errorMsg += "Gagal menghapus: " + result.payload + ". "
      }
    }

    if (success && (addedIds.length > 0 || removedIds.length > 0)) {
      toast.success("Berhasil menyimpan target materi")
      dispatch(
        getGroupTargetsSummaryMaterial({
          subcategory,
          month: targetMaterialMonth,
          year: targetMaterialYear,
          grades: targetGrade,
        }),
      )
    } else if (!success) {
      toast.error(errorMsg)
    }
  }

  return (
    <>
      <BackHeader title={subcategory.replace(/%20/g, " ")} />

      {!isSuccess ? (
        <Card align='center'>
          <CardContent>
            <CircularProgress size='3rem' />
          </CardContent>
        </Card>
      ) : (
        <>
          <Container sx={{ mt: 3, mb: 10 }}>
            {isQuranHaditsCategory && (
              <Typography pb={1}>Halaman {category}:</Typography>
            )}

            <Grid
              container
              spacing={1}
              direction='row'
              alignItems='center'
              mt={1}
              mb={2}
            >
              <Grid item>
                <Button
                  sx={{ fontSize: 11 }}
                  variant='contained'
                  onClick={selectAllInputs}
                >
                  Pilih Semua
                </Button>
              </Grid>
              <Grid item xs style={{ flexGrow: 1 }}></Grid>
              <Grid item>
                <Button
                  disabled={!isModified()}
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
                  disabled={!isModified()}
                  sx={{ fontSize: 11 }}
                  variant='contained'
                  onClick={saveInputs}
                  color='success'
                >
                  Simpan
                </Button>
              </Grid>
            </Grid>

            <Grid pb={10} container spacing={2}>
              {groupTargetsSummaryMaterial &&
                groupTargetsSummaryMaterial.map((sumCompletion, index) => (
                  <Grid
                    item
                    xs={
                      isQuranHaditsCategory &&
                      isPageNumber(sumCompletion.material)
                        ? 3
                        : 12
                    }
                    md={
                      isQuranHaditsCategory &&
                      isPageNumber(sumCompletion.material)
                        ? 2
                        : 12
                    }
                    key={index}
                    onClick={() => onClickInput(sumCompletion)}
                    sx={{ cursor: "pointer" }}
                  >
                    <SumCompletionCard
                      key={index}
                      title={sumCompletion.material}
                      structure='material'
                      grade={isQuranHaditsCategory ? null : sumCompletion.grade}
                      backgroundColor={cardColor(sumCompletion).background}
                      fontColor={cardColor(sumCompletion).font}
                      disabled={true}
                    />
                  </Grid>
                ))}
              <Grid item xs={12}>
                {groupTargetsSummaryMaterial?.length === 0 && (
                  <Typography align='center' variant='body2'>
                    Tidak ada target materi pada kelas ini.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </>
  )
}

export default MaterialTargetGroupInput
