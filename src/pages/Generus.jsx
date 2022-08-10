import { Box, Chip, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import PeopleCard from '../components/PeopleCard'
import { getUsers, getUsersPaginate, reset } from '../features/users/userSlice'

function Generus() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { users } = useSelector((state) => state.users)
  const [page, setpage] = useState(2)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('GENERUS')
  const [hasmore, setHasmore] = useState(true)

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getUsers({ page: 1, search, role }))
    dispatch(reset())
  }, [user, search, role, navigate, dispatch])

  const loadMoreUsers = () => {
    dispatch(getUsersPaginate({ page, search, role }))
    if (users.length%20 !== 0) setHasmore(false)
    setpage(page + 1)
  }

  const onChange = (e) => {
    setSearch(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(getUsersPaginate({ page, search, role }))
  }

  const handleClick = (e) => {
    setRole(e.target.innerText)
    dispatch(getUsersPaginate({ page, search, role }))
  }

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Daftar Pengguna</Typography>

      <form onSubmit={onSubmit}>
        <Grid container justifyContent='center' padding={2}>
          <Grid item xs={12}>
            <TextField
              name='search'
              placeholder={`Cari ${role.toLowerCase()}...`}
              variant='standard'
              value={search}
              onChange={onChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
      </form>

      {(user?.role !== 'MT' && user?.role !== 'MS') &&
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
      }
      <InfiniteScroll
        dataLength={users.length}
        next={loadMoreUsers}
        hasMore={hasmore}
        loader={
          <Grid align='center' sx={{ pt: 1.5 }}>
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