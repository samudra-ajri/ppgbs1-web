import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material"
import {
  getGroupSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import SumCompletionCard from "../components/SumCompletionCard"
import { logout } from "../features/auth/authSlice"
import { getppd } from "../features/organizations/organizationSlice"
import BackHeader from "../components/BackHeader"
import gradeShortEnum from "../enums/gradeShortEnum"

function MaterialTargetDetail() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Get state passed from MaterialTarget
  const { month, year, grades } = location.state || {}

  const { user } = useSelector((state) => state.auth)
  const { sumCompletions, isSuccess, isError, message } = useSelector(
    (state) => state.completionScores,
  )
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

  // Derive filters from state and user context
  const filters = {
    structure: "category",
    ancestorId: initialAncestorIdFilter(),
    organizationId: "", // Default to empty or handle logic if needed
    usersGrade: grades || [],
    targetType: "monthly",
    month: month || new Date().getMonth() + 1,
    year: year || new Date().getFullYear(),
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

    // Fetch data
    dispatch(reset())

    // Construct params for getGroupSumCompletions
    const params = {
      ...filters,
      targetMaterialMonth: filters.month,
      targetMaterialYear: filters.year,
      targetGrade:
        filters.usersGrade && filters.usersGrade.length > 0
          ? filters.usersGrade.join(",")
          : null,
    }
    dispatch(getGroupSumCompletions(params))
  }, [
    isError,
    navigate,
    dispatch,
    message,
    ppdList,
    isPPG,
    month,
    year,
    grades,
  ]) // Add dependencies

  return (
    <>
      <BackHeader
        capitalizeTitle={false}
        title={`Target ${month}/${year} ${
          grades?.map((grade) => gradeShortEnum[grade]).join(", ") ||
          "Semua Kelas"
        }`}
      />

      {!isSuccess ? (
        <Grid pb={10}>
          <Card align='center'>
            <CardContent>
              <CircularProgress size='3rem' />
            </CardContent>
          </Card>
        </Grid>
      ) : (
        <Container sx={{ mt: 3, mb: 10 }}>
          {sumCompletions?.length === 0 && (
            <Typography align='center' sx={{ mt: 5 }}>
              Target bulan ini belum dibuat.
            </Typography>
          )}

          <Grid
            container
            pb={10}
            pt={sumCompletions?.length > 0 ? 0 : 3}
            spacing={2}
          >
            {sumCompletions &&
              sumCompletions.map((sumCompletion, index) => {
                const queryParams = []
                // Always monthly target mode here
                queryParams.push(`targetMaterialMonth=${filters.month}`)
                queryParams.push(`targetMaterialYear=${filters.year}`)
                if (filters.usersGrade && filters.usersGrade.length > 0) {
                  queryParams.push(
                    `targetGrade=${filters.usersGrade.join(",")}`,
                  )
                }

                const queryString =
                  queryParams.length > 0 ? `?${queryParams.join("&")}` : ""

                // Link to existing GroupCompletionByCategory
                return (
                  <Grid item xs={6} key={index}>
                    <SumCompletionCard
                      key={index}
                      structure='material'
                      totalTarget={sumCompletion.materialCount}
                      percentage={sumCompletion.percentage}
                      title={sumCompletion.category}
                      link={`/c/material-target/detail/${sumCompletion.category}${queryString}`}
                    />
                  </Grid>
                )
              })}
          </Grid>
        </Container>
      )}
    </>
  )
}

export default MaterialTargetDetail
