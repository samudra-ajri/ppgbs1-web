import { CircularProgress, Grid, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from "react-infinite-scroll-component"
import PeopleCard from '../components/PeopleCard'
import { getUsers, getUsersPaginate, reset } from '../features/users/userSlice'

function Generus() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { users, isLoading } = useSelector((state) => state.users)
  const [page, setpage] = useState(2)
  const [search, setSearch] = useState('')
  const [hasmore, setHasmore] = useState(true)

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getUsers({ page: 1, search }))
    dispatch(reset())
  }, [user, search, navigate, dispatch])

  const loadMoreUsers = () => {
    dispatch(getUsersPaginate({ page, search }))
    if (!isLoading) setHasmore(false)
    setpage(page + 1)
  }

  const onChange = (e) => {
    setSearch(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(getUsersPaginate({ page, search }))
  }

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Daftar Generus</Typography>

      <form onSubmit={onSubmit}>
        <Grid container justifyContent='center' padding={2}>
          <Grid item xs={12}>
            <TextField
              name='search'
              placeholder='Cari generus...'
              variant='standard'
              value={search}
              onChange={onChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
      </form>

      <InfiniteScroll
        dataLength={users.length}
        next={loadMoreUsers}
        hasMore={hasmore}
        loader={
          <Grid align="center" sx={{ pt: 1.5 }}>
            <CircularProgress size={20} />
          </Grid>
        }
        endMessage={
          <Typography align='center' p={3} color='text.secondary' variant='body2'>
            {users.length === 0 && 'Tidak ditemukan'}
          </Typography>
        }
      >
        {users.map(user =>
          <PeopleCard
            key={user._id}
            user={user}
          />
        )}
      </InfiniteScroll>
    </>
  )
}

export default Generus