import { CircularProgress, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from "react-infinite-scroll-component";
import PeopleCard from '../components/PeopleCard'
import { getUsersPaginate, reset } from '../features/users/userSlice'

function Generus() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { users } = useSelector((state) => state.users)
  const [page, setpage] = useState(2)
  const [hasmore, setHasmore] = useState(true)

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getUsersPaginate(1))
    dispatch(reset())
  }, [user, navigate, dispatch])

  const loadMoreUsers = () => {
    if (users.length % 10 !== 0) {
      setHasmore(false);
    }
    dispatch(getUsersPaginate(page))
    setpage(page + 1)
  }

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Daftar Generus</Typography>
      <InfiniteScroll
        dataLength={users.length}
        next={loadMoreUsers}
        hasMore={hasmore}
        loader={
          <Grid align="center" sx={{ pt: 1.5 }}>
            <CircularProgress size={20} />
          </Grid>
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