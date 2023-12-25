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
} from "@mui/material"
import FilterIcon from "@mui/icons-material/FilterListRounded"
import CloseIcon from "@mui/icons-material/CloseRounded"
import {
  getGroupSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import SumCompletionCard from "../components/SumCompletionCard"
import { logout } from "../features/auth/authSlice"
import { getppd, getppk } from "../features/organizations/organizationSlice"
import gradeEnum from "../enums/gradeEnum"

function GroupCompletion() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { sumCompletions, isSuccess, isError, message } = useSelector(
    (state) => state.completionScores
  )
  const { ppd: ppdList, ppk: ppkList } = useSelector(
    (state) => state.organizations
  )

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
    structure: "category",
    ancestorId: initialAncestorIdFilter(),
  })
  const [filters, setFilters] = useState({
    structure: "category",
    ancestorId: initialAncestorIdFilter(),
    organizationId: "",
    usersGrade: "",
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
    dispatch(getGroupSumCompletions(filters))
  }, [dispatch, filters])

  useEffect(() => {
    if (drawerFilters.ancestorId) dispatch(getppk(drawerFilters.ancestorId))
  }, [dispatch, drawerFilters.ancestorId])

  const toggleDrawer = (open) => (event) => {
    setFilters((prevState) => ({
      ...prevState,
      ...drawerFilters,
    }))
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

    setDrawerFilters((prevState) => ({
      ...prevState,
      [key]: value === drawerFilters[key] ? "" : value,
    }))
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
        {Object.keys(gradeEnum).map((key) => (
          <Grid item key={key}>
            <Chip
              label={gradeEnum[key]}
              color='info'
              variant={drawerFilters.usersGrade === key ? "solid" : "outlined"}
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
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>
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
            {sumCompletions ? sumCompletions[0].materialsMultiplier : 0}
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

      {!isSuccess ? (
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
                link={`/c/group-completion/${sumCompletion.category}`}
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
