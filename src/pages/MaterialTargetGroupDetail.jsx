import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import BackHeader from "../components/BackHeader"
import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material"
import { Box, Container } from "@mui/system"
import SumCompletionCard from "../components/SumCompletionCard"
import {
  getGroupTargetsSummarySubcategory,
  reset,
} from "../features/materialTargets/materialTargetSlice"
import { logout } from "../features/auth/authSlice"
import { getppd } from "../features/organizations/organizationSlice"

function MaterialTargetGroupDetail() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const targetMaterialMonth = searchParams.get("targetMaterialMonth")
  const targetMaterialYear = searchParams.get("targetMaterialYear")
  const targetGrade = searchParams.get("targetGrade")

  const pathnames = window.location.pathname.split("/")
  // Path is /c/material-target/detail/:category
  // split: ["", "c", "material-target", "detail", "Al-Quran"]
  // index 4 is category.
  const category = decodeURIComponent(pathnames[4])

  const { groupTargetsSummarySubcategory, isSuccess, isError, message } =
    useSelector((state) => state.materialTargets)
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

    const params = {
      category,
      month: targetMaterialMonth,
      year: targetMaterialYear,
      grades: targetGrade,
    }

    dispatch(getGroupTargetsSummarySubcategory(params))
    dispatch(reset())
  }, [
    navigate,
    dispatch,
    category,
    isError,
    message,
    targetMaterialMonth,
    targetMaterialYear,
    targetGrade,
    ppdList,
    isPPG,
    user,
  ])

  return (
    <>
      <BackHeader title={category} />

      {!isSuccess ? (
        <Card align='center'>
          <CardContent>
            <CircularProgress size='3rem' />
          </CardContent>
        </Card>
      ) : (
        <Container sx={{ mt: 3, mb: 10 }}>
          <Grid container pb={10} spacing={2}>
            {groupTargetsSummarySubcategory &&
              groupTargetsSummarySubcategory.map((sumCompletion, index) => {
                const queryParams = []
                if (targetMaterialMonth)
                  queryParams.push(`targetMaterialMonth=${targetMaterialMonth}`)
                if (targetMaterialYear)
                  queryParams.push(`targetMaterialYear=${targetMaterialYear}`)
                if (targetGrade) queryParams.push(`targetGrade=${targetGrade}`)
                const queryString =
                  queryParams.length > 0 ? `?${queryParams.join("&")}` : ""

                return (
                  <Grid item xs={6} key={index}>
                    <SumCompletionCard
                      key={index}
                      structure='material'
                      totalTarget={sumCompletion.targetedCount}
                      percentage={sumCompletion.percentage}
                      title={sumCompletion.subcategory}
                      link={`/c/material-target/detail/${category}/${sumCompletion.subcategory}${queryString}`}
                    />
                  </Grid>
                )
              })}
            <Grid item xs={12}>
              {groupTargetsSummarySubcategory?.length === 0 && (
                <Typography align='center' variant='body2'>
                  Tidak ada target materi pada kelas ini.
                </Typography>
              )}
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  )
}

export default MaterialTargetGroupDetail
