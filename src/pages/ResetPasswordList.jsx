import { CircularProgress, Grid, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroll-component"
import { getUsers, getUsersPaginate, reset } from "../features/users/userSlice"
import { reset as resetAuth } from "../features/auth/authSlice"
import PeopleCardResetPassword from "../components/PeopleCardResetPassword"

function ResetPasswordList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { users } = useSelector((state) => state.users)
  const [page, setpage] = useState(2)
  const [search, setSearch] = useState("")
  const role = ""

  useEffect(() => {
    if (!user) navigate("/login")
    dispatch(getUsers({ page: 1, search, role, needresetpassword: true }))
    dispatch(reset())
    dispatch(resetAuth())
  }, [user, search, role, navigate, dispatch])

  const loadMoreUsers = () => {
    dispatch(getUsersPaginate({ page, search, role, needresetpassword: true }))
    setpage(page + 1)
  }

  const onChange = (e) => {
    setSearch(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(getUsersPaginate({ page, search, role, needresetpassword: true }))
  }

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>
        Permohonan Reset Password
      </Typography>

      <form onSubmit={onSubmit}>
        <Grid container justifyContent='center' padding={2}>
          <Grid item xs={12}>
            <TextField
              name='search'
              placeholder={`Cari berdasarkan nama...`}
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
            {users.length === 0 && "Tidak ada permohonan reset password"}
          </Typography>
        }
      >
        {users.map((u) => (
          <PeopleCardResetPassword key={u._id} user={u} />
        ))}
      </InfiniteScroll>
    </>
  )
}

export default ResetPasswordList
