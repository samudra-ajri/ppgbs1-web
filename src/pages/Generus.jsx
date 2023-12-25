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
  TextField,
  Toolbar,
  Typography,
} from "@mui/material"
import FilterIcon from "@mui/icons-material/FilterListRounded"
import CloseIcon from "@mui/icons-material/CloseRounded"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroll-component"
import PeopleCard from "../components/PeopleCard"
import { getUsersPaginate, reset } from "../features/users/userSlice"
import { getppd, getppk } from "../features/organizations/organizationSlice"

import gradeEnum from "../enums/gradeEnum"

function Generus() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { users, totalCount, hasNextPage, isLoading } = useSelector(
    (state) => state.users
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

  const [searchBar, setSearchBar] = useState("")
  const [stateDrawer, setStateDrawer] = useState(false)
  const [drawerFilters, setDrawerFilters] = useState({
    positionType: "GENERUS",
    ancestorId: initialAncestorIdFilter(),
  })
  const [filters, setFilters] = useState({
    page: 1,
    positionType: "GENERUS",
    ancestorId: initialAncestorIdFilter(),
    organizationId: "",
    sex: "",
    grade: "",
    search: "",
  })

  const toggleDrawer = (open) => (event) => {
    setFilters((prevState) => ({
      ...prevState,
      ...drawerFilters,
    }))
    dispatch(reset())
    setStateDrawer(open)
  }

  useEffect(() => {
    if (!user) navigate("/login")
    if (!ppdList && isPPG) dispatch(getppd())
    return () => {
      dispatch(reset())
    }
  }, [user, navigate, dispatch, ppdList, isPPG])

  useEffect(() => {
    dispatch(getUsersPaginate(filters))
  }, [dispatch, filters])

  useEffect(() => {
    if (drawerFilters.ancestorId) dispatch(getppk(drawerFilters.ancestorId))
  }, [dispatch, drawerFilters.ancestorId])

  const loadMoreUsers = () => {
    setFilters((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }))
  }

  const onChange = (e) => {
    setSearchBar(e.target.value)
  }

  const handleFilterObject = (key, value) => (event) => {
    // reset the garade filter regarding to the positionType
    if (drawerFilters.positionType === "PENGAJAR") {
      setDrawerFilters((prevState) => ({
        ...prevState,
        grade: "",
      }))
    }

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

  const onSubmit = (e) => {
    e.preventDefault()
    setFilters((prevState) => ({
      ...prevState,
      search: searchBar,
    }))
    dispatch(reset())
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
            label='Generus'
            color='info'
            variant={
              drawerFilters.positionType === "GENERUS" ? "solid" : "outlined"
            }
            onClick={handleFilterObject("positionType", "GENERUS")}
          />
        </Grid>
        <Grid item>
          <Chip
            label='Pengajar'
            color='info'
            variant={
              drawerFilters.positionType === "PENGAJAR" ? "solid" : "outlined"
            }
            onClick={handleFilterObject("positionType", "PENGAJAR")}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1} pb={3} pl={1}>
        <Grid item>
          <Chip
            label='Laki-laki'
            color='info'
            variant={drawerFilters.sex === 1 ? "solid" : "outlined"}
            onClick={handleFilterObject("sex", 1)}
          />
        </Grid>
        <Grid item>
          <Chip
            label='Perempuan'
            color='info'
            variant={drawerFilters.sex === 0 ? "solid" : "outlined"}
            onClick={handleFilterObject("sex", 0)}
          />
        </Grid>
      </Grid>

      {drawerFilters.positionType !== "PENGAJAR" && (
        <Grid container spacing={1} pb={3} pl={1}>
          {Object.keys(gradeEnum).map((key) => (
            <Grid item key={key}>
              <Chip
                label={gradeEnum[key]}
                color='info'
                variant={drawerFilters.grade === key ? "solid" : "outlined"}
                onClick={handleFilterObject("grade", key)}
              />
            </Grid>
          ))}
        </Grid>
      )}

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
        Users
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
          <Typography variant='h5'>{totalCount}</Typography>
          <Typography variant='body2'>Orang</Typography>
        </CardContent>
      </Card>

      <form onSubmit={onSubmit}>
        <Grid container paddingBottom={2} paddingTop={5} spacing={2}>
          <Grid item xs={9}>
            <TextField
              name='search'
              placeholder={`Cari berdasarkan nama...`}
              size='small'
              value={searchBar}
              onChange={onChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              size='small'
              type='submit'
              variant='contained'
              color='info'
              fullWidth
              style={{ paddingTop: "9px", paddingBottom: "8px" }}
            >
              Cari
            </Button>
          </Grid>
        </Grid>
      </form>

      <Grid pb={1}>
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

      {isLoading && (
        <Grid align='center' sx={{ pt: 1.5 }}>
          <CircularProgress size={20} />
        </Grid>
      )}

      <InfiniteScroll
        dataLength={users.length}
        next={loadMoreUsers}
        hasMore={hasNextPage}
        loader={
          <Grid align='center' sx={{ pt: 1.5 }}>
            <CircularProgress size={20} />
          </Grid>
        }
        endMessage={
          <Typography
            align='center'
            p={3}
            color='text.secondary'
            variant='body2'
          >
            {!isLoading && users.length === 0 && "User tidak ditemukan."}
          </Typography>
        }
      >
        {users.map((userDetail, index) => (
          <PeopleCard
            key={index}
            user={userDetail}
            canDelete={user?.currentPosition.type === "ADMIN"}
          />
        ))}
      </InfiniteScroll>

      <Drawer anchor='left' open={stateDrawer} onClose={toggleDrawer(false)}>
        <Container>{filterList()}</Container>
      </Drawer>
    </>
  )
}

export default Generus
