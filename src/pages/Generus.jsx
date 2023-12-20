import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroll-component"
import PeopleCard from "../components/PeopleCard"
import { getUsers, getUsersPaginate, reset } from "../features/users/userSlice"

function Generus() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { users, isLoading } = useSelector((state) => state.users)
  // const [page, setpage] = useState(2)
  const [searchBar, setSearchBar] = useState("")
  const [filters, setFilters] = useState({
    page: 1,
    positionType: "GENERUS",
    organizationId: "",
    sex: "",
    grade: "",
    search: "",
  })

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

  const onSubmit = (e) => {
    e.preventDefault()
    setFilters((prevState) => ({
      ...prevState,
      search: searchBar,
    }))
    dispatch(reset())
  }

  // const handleClick = (e) => {
  //   if (e.target.innerText !== role) {
  //     setRole(e.target.innerText)
  //     setpage(2)
  //   }
  // }

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>
        Users
      </Typography>

      <Grid container paddingBottom={5} paddingTop={5} spacing={2}>
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
      
      {isLoading && (
        <Grid align='center' sx={{ pt: 1.5 }}>
          <CircularProgress size={20} />
        </Grid>
      )}

      {/* {(user?.role !== 'MT' && user?.role !== 'MS' && user?.role !== 'ADMIN') &&
      <Box pb={1}>
          <Chip
            variant={role === 'GENERUS' ? 'solid' : 'outlined'}
            label={<Typography sx={{ fontSize: 10 }}>GENERUS</Typography>}
            name='SEMUA KLP'
            color='info'
            sx={{ m: 0.25 }}
            onClick={handleClick}
          />
          <Chip
            variant={role === 'MUBALLIGH' ? 'solid' : 'outlined'}
            label={<Typography sx={{ fontSize: 10 }}>MUBALLIGH</Typography>}
            name='SEMUA KLP'
            color='info'
            sx={{ m: 0.25 }}
            onClick={handleClick}
          />
        </Box>
      } */}

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
    </>
  )
}

export default Generus
