import {
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import BackHeader from "../components/BackHeader"
import SumCompletionCard from "../components/SumCompletionCard"
import {
  getGroupSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import { logout } from "../features/auth/authSlice"
import { getppd } from "../features/organizations/organizationSlice"

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

  const { sumCompletions, isSuccess, isError, message } = useSelector(
    (state) => state.completionScores,
  )
  const { user } = useSelector((state) => state.auth)
  const { ppd: ppdList } = useSelector((state) => state.organizations)

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
      getGroupSumCompletions({
        structure: "material",
        subcategory: subcategory,
        ancestorId: initialAncestorIdFilter(),
        organizationId: "",
        usersGrade: targetGrade ? targetGrade.split(",") : [],
        targetMaterialMonth,
        targetMaterialYear,
        targetGrade,
      }),
    )
    dispatch(reset())
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

  const isQuranHaditsCategory = category === "Al-Quran" || category === "Hadits"
  const isPageNumber = (string) => {
    return /^\d+$/.test(string)
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

            <Grid pb={10} container spacing={2}>
              {sumCompletions.map((sumCompletion, index) => (
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
                >
                  <SumCompletionCard
                    key={index}
                    title={sumCompletion.material}
                    structure='material'
                    grade={isQuranHaditsCategory ? null : sumCompletion.grade}
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
          </Container>
        </>
      )}
    </>
  )
}

export default MaterialTargetGroupInput
