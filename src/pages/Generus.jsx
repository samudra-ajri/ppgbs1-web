import {
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
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroll-component"
import PeopleCard from "../components/PeopleCard"
import { getUsersPaginate, reset } from "../features/users/userSlice"
import FilterIcon from "@mui/icons-material/FilterListRounded"
import CloseIcon from "@mui/icons-material/CloseRounded"
import gradeEnum from "../enums/gradeEnum"

function Generus() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { users, totalCount, isLoading } = useSelector((state) => state.users)
  const [searchBar, setSearchBar] = useState("")
  const [stateDrawer, setStateDrawer] = useState(false)
  const [filters, setFilters] = useState({
    page: 1,
    positionType: "GENERUS",
    organizationId: "",
    sex: "",
    grade: "",
    search: "",
  })

  const toggleDrawer = (open) => (event) => {
    setStateDrawer(open)
  }

  useEffect(() => {
    if (!user) navigate("/login")
    return () => {
      dispatch(reset())
    }
  }, [user, navigate, dispatch])

  useEffect(() => {
    dispatch(getUsersPaginate(filters))
  }, [dispatch, filters])

  const loadMoreUsers = () => {
    setFilters((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }))
  }

  const onChange = (e) => {
    setSearchBar(e.target.value)
  }

  const setFilterObject = (key, value) => (event) => {
    dispatch(reset())
    setFilters((prevState) => ({
      ...prevState,
      [key]: value === filters[key] ? "" : value,
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
      <Grid pt={3} sx={{ width: "250px" }}>
        <IconButton aria-label='delete' onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Grid>

      <Grid item xs={12} pb={4}>
        <Typography textAlign='center'>
          <b>Filters</b>
        </Typography>
      </Grid>

      <Grid container spacing={0.5} pb={3} pl={1}>
        <Grid item>
          <Chip
            label='Generus'
            color='info'
            variant={filters.positionType === "GENERUS" ? "solid" : "outlined"}
            onClick={setFilterObject("positionType", "GENERUS")}
          />
        </Grid>
        <Grid item>
          <Chip
            label='Pengajar'
            color='info'
            variant={filters.positionType === "PENGAJAR" ? "solid" : "outlined"}
            onClick={setFilterObject("positionType", "PENGAJAR")}
          />
        </Grid>
      </Grid>

      <Grid container spacing={0.5} pb={3} pl={1}>
        <Grid item>
          <Chip
            label='Laki-laki'
            color='info'
            variant={filters.sex === 1 ? "solid" : "outlined"}
            onClick={setFilterObject("sex", 1)}
          />
        </Grid>
        <Grid item>
          <Chip
            label='Perempuan'
            color='info'
            variant={filters.sex === 0 ? "solid" : "outlined"}
            onClick={setFilterObject("sex", 0)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={0.5} pb={3} pl={1}>
        {Object.keys(gradeEnum).map((key) => (
          <Grid item key={key}>
            <Chip
              label={gradeEnum[key]}
              color='info'
              variant={filters.grade === key ? "solid" : "outlined"}
              onClick={setFilterObject("grade", key)}
            />
          </Grid>
        ))}
      </Grid>
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

      <Grid container paddingBottom={2} paddingTop={5} spacing={2}>
        <Grid item xs={9}>
          <TextField
            name='search'
            placeholder={`Cari berdasarkan nama...`}
            size='small'
            value={searchBar}
            onChange={onChange}
            fullWidth
            required
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
            onClick={onSubmit}
          >
            Cari
          </Button>
        </Grid>
      </Grid>

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
        hasMore={users.length % 20 !== 0 || users.length === 0 ? false : true}
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
