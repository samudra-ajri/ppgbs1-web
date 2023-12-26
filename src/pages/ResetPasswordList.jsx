import { CircularProgress, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroll-component"
import PeopleCard from "../components/PeopleCard"
import { getUsersPaginate, reset } from "../features/users/userSlice"

function ResetPasswordList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { users, hasNextPage, isLoading } = useSelector((state) => state.users)

  const [filters, setFilters] = useState({
    page: 1,
    ancestorId: user.currentPosition.organizationId,
    isForgotPassword: true,
  })

  useEffect(() => {
    if (!user) navigate("/login")
    return () => {
      dispatch(reset())
    }
  }, [dispatch, navigate, user])

  useEffect(() => {
    dispatch(getUsersPaginate(filters))
  }, [dispatch, filters])

  const loadMoreUsers = () => {
    setFilters((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }))
  }

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Permohonan Reset Password
      </Typography>

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
          <PeopleCard key={index} user={userDetail} link='/c/reset-passwords' />
        ))}
      </InfiniteScroll>
    </>
  )
}

export default ResetPasswordList
