import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  AppBar,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Drawer,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  TextField,
  MenuItem,
  Box,
} from "@mui/material"
import FilterIcon from "@mui/icons-material/FilterListRounded"
import CloseIcon from "@mui/icons-material/CloseRounded"
import {
  getGroupSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import SumCompletionCard from "../components/SumCompletionCard"
import LinearProgressWithLabel from "../components/LinearProgressWithLabel"
import { logout } from "../features/auth/authSlice"
import { getppd, getppk } from "../features/organizations/organizationSlice"
import gradeEnum from "../enums/gradeEnum"
import { createInitialData } from "../features/initialData/initialDataSlice"

function GroupCompletion() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { sumCompletions, isSuccess, isError, message } = useSelector(
    (state) => state.completionScores,
  )
  const { ppd: ppdList, ppk: ppkList } = useSelector(
    (state) => state.organizations,
  )
  const { initialData } = useSelector((state) => state.initialData)

  const totalCompletionCount = sumCompletions?.reduce(
    (acc, curr) => acc + (curr.completionCount || 0),
    0,
  )
  const totalMaterialCount = sumCompletions?.reduce(
    (acc, curr) =>
      acc + (curr.materialCount || 0) * (curr.materialsMultiplier || 0),
    0,
  )

  const totalPercentage =
    totalMaterialCount > 0
      ? (totalCompletionCount / totalMaterialCount) * 100
      : 0

  const isPPG = user.currentPosition.organizationLevel === 0
  const isPPDOrTeacher =
    user.currentPosition.organizationLevel === 1 ||
    user.currentPosition.type === "PENGAJAR"

  const initialAncestorIdFilter = () => {
    const isPPD = user.currentPosition.organizationLevel === 1
    if (!isPPDOrTeacher) return ""
    if (isPPD) return user.currentPosition.organizationId
    return user.currentPosition.organizationAncestorId // return the PPD organizationId
  }

  const [stateDrawer, setStateDrawer] = useState(false)
  const [drawerFilters, setDrawerFilters] = useState({
    ancestorId:
      initialData?.groupCompletionFilters?.ancestorId ||
      initialAncestorIdFilter(),
    organizationId: initialData?.groupCompletionFilters?.organizationId,
    usersGrade: initialData?.groupCompletionFilters?.usersGrade || [],
    targetType: initialData?.groupCompletionFilters?.targetType || "overall",
    month:
      initialData?.groupCompletionFilters?.month || new Date().getMonth() + 1,
    year: initialData?.groupCompletionFilters?.year || new Date().getFullYear(),
  })
  const [filters, setFilters] = useState({
    structure: "category",
    ancestorId:
      initialData?.groupCompletionFilters?.ancestorId ||
      initialAncestorIdFilter(),
    organizationId: initialData?.groupCompletionFilters?.organizationId || "",
    usersGrade: initialData?.groupCompletionFilters?.usersGrade || [],
    targetType: initialData?.groupCompletionFilters?.targetType || "overall",
    month:
      initialData?.groupCompletionFilters?.month || new Date().getMonth() + 1,
    year: initialData?.groupCompletionFilters?.year || new Date().getFullYear(),
  })

  useEffect(() => {
    if (isError && message === "Missing authentication.") {
      dispatch(logout())
      navigate("/login")
      return
    }
    if (!ppdList && isPPG) dispatch(getppd())
    dispatch(reset())
  }, [isError, navigate, dispatch, message, ppdList, isPPG])

  useEffect(() => {
    const fetchData = async () => {
      if (filters.targetType === "monthly") {
        dispatch(
          getGroupSumCompletions({
            ...filters,
            targetMaterialMonth: filters.month,
            targetMaterialYear: filters.year,
            targetGrade:
              filters.usersGrade && filters.usersGrade.length > 0
                ? filters.usersGrade.join(",")
                : null,
          }),
        )
      } else {
        dispatch(getGroupSumCompletions(filters))
      }
    }
    fetchData()
  }, [dispatch, filters])

  useEffect(() => {
    if (drawerFilters.ancestorId) dispatch(getppk(drawerFilters.ancestorId))
  }, [dispatch, drawerFilters.ancestorId])

  const toggleDrawer = (open) => (event) => {
    setFilters((prevState) => ({
      ...prevState,
      ...drawerFilters,
    }))
    dispatch(createInitialData({ groupCompletionFilters: drawerFilters }))
    dispatch(reset())
    setStateDrawer(open)
  }

  const handleFilterObject = (key, value) => (event) => {
    // reset the organizationId filter regarding to the ancestorid
    if (key === "ancestorId") {
      setDrawerFilters((prevState) => ({
        ...prevState,
        organizationId: "",
      }))
    }

    if (key === "usersGrade") {
      // multiple grades filter
      if (drawerFilters.usersGrade.includes(value)) {
        // Removes the value if it already exists in the grade array
        const grades = drawerFilters.usersGrade.filter(
          (grade) => grade !== value,
        )
        setDrawerFilters((prevState) => ({
          ...prevState,
          usersGrade: grades,
        }))
      } else {
        // Adds the value if it doesn't exist in the grade array
        setDrawerFilters((prevState) => ({
          ...prevState,
          usersGrade: [...prevState.usersGrade, value],
        }))
      }
    } else {
      // Handles other keys
      setDrawerFilters((prevState) => ({
        ...prevState,
        [key]: value === prevState[key] ? "" : value,
      }))
    }
  }

  const filterList = () => (
    <>
      <Grid pt={3} sx={{ width: "100vw" }}>
        <IconButton aria-label='delete' onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Grid>

      <Grid item xs={12} pb={4}>
        <Typography textAlign='center'>
          <b>Filters</b>
        </Typography>
      </Grid>

      <Grid container spacing={1} pb={3} pl={1}>
        <Grid item>
          <Chip
            label='Target Keseluruhan (GGB)'
            color='info'
            variant={
              drawerFilters.targetType === "overall" ? "solid" : "outlined"
            }
            onClick={() =>
              setDrawerFilters((prev) => ({ ...prev, targetType: "overall" }))
            }
          />
        </Grid>
        <Grid item>
          <Chip
            label='Target Bulanan'
            color='info'
            variant={
              drawerFilters.targetType === "monthly" ? "solid" : "outlined"
            }
            onClick={() =>
              setDrawerFilters((prev) => ({ ...prev, targetType: "monthly" }))
            }
          />
        </Grid>

        {drawerFilters.targetType === "monthly" && (
          <Grid container item spacing={2} mt={-1}>
            <Grid item xs={5} sm={2}>
              <TextField
                select
                fullWidth
                size='small'
                label='Bulan'
                value={drawerFilters.month}
                onChange={(e) =>
                  setDrawerFilters((prev) => ({
                    ...prev,
                    month: e.target.value,
                  }))
                }
              >
                {Array.from(Array(12)).map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={5} sm={2}>
              <TextField
                fullWidth
                size='small'
                label='Tahun'
                type='number'
                value={drawerFilters.year}
                onChange={(e) =>
                  setDrawerFilters((prev) => ({
                    ...prev,
                    year: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
        )}
      </Grid>

      <Grid container spacing={1} pb={3} pl={1}>
        {Object.keys(gradeEnum).map((key) => (
          <Grid item key={key}>
            <Chip
              label={gradeEnum[key]}
              color='info'
              variant={
                drawerFilters.usersGrade.includes(key) ? "solid" : "outlined"
              }
              onClick={handleFilterObject("usersGrade", key)}
            />
          </Grid>
        ))}
      </Grid>

      {isPPG && (
        <Grid container spacing={1} pb={3} pl={1}>
          {ppdList?.data.map((ppd) => (
            <Grid item key={ppd.id}>
              <Chip
                label={ppd.name}
                color='info'
                variant={
                  drawerFilters.ancestorId === ppd.id ? "solid" : "outlined"
                }
                onClick={handleFilterObject("ancestorId", ppd.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {drawerFilters.ancestorId && (isPPG || isPPDOrTeacher) && (
        <Grid container spacing={1} pb={3} pl={1}>
          {ppkList?.data.map((ppk) => (
            <Grid item key={ppk.id}>
              <Chip
                label={ppk.name}
                color='info'
                variant={
                  drawerFilters.organizationId === ppk.id ? "solid" : "outlined"
                }
                onClick={handleFilterObject("organizationId", ppk.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Grid pb={10} />

      <AppBar position='fixed' color='inherit' sx={{ top: "auto", bottom: 0 }}>
        <Toolbar>
          <Grid container justifyContent='center' style={{ width: "100%" }}>
            <Grid item xs={12}>
              <Button
                variant='contained'
                color='info'
                fullWidth
                onClick={toggleDrawer(false)}
              >
                Lihat
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  )

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Capaian Materi
      </Typography>

      <Card sx={{ mb: 0.5 }} align='center'>
        <CardContent
          sx={{
            padding: 2,
            "&:last-child": {
              paddingBottom: 2,
            },
          }}
        >
          <Typography variant='body1'>Jumlah</Typography>
          <Typography variant='h5'>
            {sumCompletions ? sumCompletions[0]?.materialsMultiplier : 0}
          </Typography>
          <Typography variant='body2'>Generus</Typography>
        </CardContent>
      </Card>

      <Grid pt={2}>
        <Button
          variant='text'
          startIcon={<FilterIcon />}
          onClick={toggleDrawer(true)}
          size='small'
          color='info'
        >
          FILTERS
        </Button>
      </Grid>

      {filters.targetType === "monthly" &&
      isSuccess &&
      sumCompletions?.length === 0 ? (
        <Typography align='center' sx={{ mt: 5 }}>
          Target bulan ini belum dibuat.
        </Typography>
      ) : !isSuccess ? (
        <Grid pb={10}>
          <Card align='center'>
            <CardContent>
              <CircularProgress size='3rem' />
            </CardContent>
          </Card>
        </Grid>
      ) : (
        <Box>
          {sumCompletions?.length > 0 && (
            <Box sx={{ mb: 3, mt: 3 }}>
              <Typography
                variant='body2'
                style={{ fontWeight: "bold" }}
                gutterBottom
              >
                Total
              </Typography>
              <LinearProgressWithLabel value={totalPercentage} />
            </Box>
          )}
          <Box pb={10} pt={sumCompletions?.length > 0 ? 0 : 3}>
            {(() => {
              const groups = []
              const groupMap = new Map()

              sumCompletions?.forEach((item) => {
                const subject = item.subject || "Lainnya"
                if (!groupMap.has(subject)) {
                  const group = { subject, items: [] }
                  groups.push(group)
                  groupMap.set(subject, group)
                }
                groupMap.get(subject).items.push(item)
              })

              return groups.map((group) => (
                <Box key={group.subject} sx={{ mb: 3 }}>
                  <Typography
                    variant='body1'
                    style={{ fontWeight: "bold" }}
                    sx={{ mb: 1, ml: 1, textTransform: "capitalize" }}
                  >
                    {group.subject.toLowerCase()}
                  </Typography>
                  <Grid container spacing={2}>
                    {group.items.map((sumCompletion, index) => {
                      const queryParams = []
                      if (filters.targetType === "monthly") {
                        queryParams.push(`targetMaterialMonth=${filters.month}`)
                        queryParams.push(`targetMaterialYear=${filters.year}`)
                        if (
                          filters.usersGrade &&
                          filters.usersGrade.length > 0
                        ) {
                          queryParams.push(
                            `targetGrade=${filters.usersGrade.join(",")}`,
                          )
                        }
                      }
                      const queryString =
                        queryParams.length > 0
                          ? `?${queryParams.join("&")}`
                          : ""
                      return (
                        <Grid item xs={6} key={index}>
                          <SumCompletionCard
                            key={index}
                            percentage={sumCompletion.percentage}
                            title={sumCompletion.category}
                            link={`/c/group-completion/${sumCompletion.category}${queryString}`}
                          />
                        </Grid>
                      )
                    })}
                  </Grid>
                </Box>
              ))
            })()}
          </Box>
        </Box>
      )}

      <Drawer anchor='left' open={stateDrawer} onClose={toggleDrawer(false)}>
        <Container>{filterList()}</Container>
      </Drawer>
    </>
  )
}

export default GroupCompletion
