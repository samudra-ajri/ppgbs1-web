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
} from "@mui/material"
import FilterIcon from "@mui/icons-material/FilterListRounded"
import CloseIcon from "@mui/icons-material/CloseRounded"
import {
  getGroupSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import { getTargetIds } from "../features/materialTargets/materialTargetSlice"
import SumCompletionCard from "../components/SumCompletionCard"
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

  const [hasTarget, setHasTarget] = useState(true)
  const [materialIds, setMaterialIds] = useState([])

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
        const params = {
          month: filters.month,
          year: filters.year,
        }
        if (filters.usersGrade && filters.usersGrade.length > 0) {
          params.grade = filters.usersGrade.join(",")
        }

        try {
          const result = await dispatch(getTargetIds(params)).unwrap()
          const ids = result.data
          if (ids && ids.length > 0) {
            setHasTarget(true)
            setMaterialIds(ids)
            dispatch(getGroupSumCompletions({ ...filters, materialIds: ids }))
          } else {
            setHasTarget(false)
            setMaterialIds([])
            dispatch(reset())
          }
        } catch (err) {
          console.error(err)
          setHasTarget(false)
          setMaterialIds([])
          dispatch(reset())
        }
      } else {
        setHasTarget(true)
        setMaterialIds([])
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

      {!hasTarget ? (
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
        <Grid container pb={10} pt={3} spacing={2}>
          {sumCompletions.map((sumCompletion, index) => (
            <Grid item xs={6} key={index}>
              <SumCompletionCard
                key={index}
                percentage={sumCompletion.percentage}
                title={sumCompletion.category}
                link={`/c/group-completion/${sumCompletion.category}${
                  materialIds.length > 0
                    ? `?materialIds=${materialIds.join(",")}`
                    : ""
                }`}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Drawer anchor='left' open={stateDrawer} onClose={toggleDrawer(false)}>
        <Container>{filterList()}</Container>
      </Drawer>
    </>
  )
}

export default GroupCompletion
