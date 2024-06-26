import {
  Button,
  CircularProgress,
  Fab,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroll-component"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import {
  getReferencesPaginate,
  reset,
} from "../features/references/referenceSlice"
import ReferenceCard from "../components/ReferenceCard"

function References() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { references, hasNextPage, isLoading } = useSelector(
    (state) => state.references
  )

  const [searchBar, setSearchBar] = useState("")
  const [filters, setFilters] = useState({ page: 1, search: "" })

  useEffect(() => {
    if (!user) navigate("/login")
    return () => dispatch(reset())
  }, [user, navigate, dispatch])

  useEffect(() => {
    dispatch(getReferencesPaginate(filters))
  }, [dispatch, filters])

  const loadMore = useCallback(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: prevFilters.page + 1,
    }))
  }, [])

  const handleSearchChange = (e) => setSearchBar(e.target.value)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setFilters({ page: 1, search: searchBar })
    dispatch(reset())
  }

  const onClickAddFile = () => {
    navigate("/c/create-reference")
  }

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Pustaka
      </Typography>

      <form onSubmit={handleSearchSubmit}>
        <Grid container spacing={2} paddingY={2}>
          <Grid item xs={9}>
            <TextField
              name='search'
              placeholder='Judul...'
              size='small'
              value={searchBar}
              onChange={handleSearchChange}
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
              sx={{ py: 1 }}
            >
              Cari
            </Button>
          </Grid>
        </Grid>
      </form>

      {isLoading && references.length === 0 && (
        <Grid container justifyContent='center' sx={{ pt: 1.5 }}>
          <CircularProgress size={20} />
        </Grid>
      )}

      <InfiniteScroll
        dataLength={references.length}
        next={loadMore}
        hasMore={hasNextPage}
        loader={
          <Grid container justifyContent='center' sx={{ pt: 1.5 }}>
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
            {!isLoading && references.length === 0 && "Data tidak ditemukan."}
          </Typography>
        }
      >
        {references.map((item, index) => (
          <ReferenceCard
            key={index}
            data={item}
            canDelete={user?.currentPosition?.organizationLevel === 0}
            link={item.url}
          />
        ))}
      </InfiniteScroll>

      {user?.currentPosition?.organizationLevel === 0 && (
        <Fab
          size='medium'
          color='info'
          aria-label='add file'
          onClick={onClickAddFile}
          sx={{ position: "fixed", bottom: 76, right: 16 }}
        >
          <AddRoundedIcon />
        </Fab>
      )}
    </>
  )
}

export default References
