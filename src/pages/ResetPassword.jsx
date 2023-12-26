import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { tempPassword, reset } from "../features/auth/authSlice"
import Spinner from "../components/Spinner"
import { Button, Grid, TextField, Typography } from "@mui/material"
import BackHeader from "../components/BackHeader"
import ProfileCard from "../components/ProfileCard"

function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    newPassword2: "",
  })
  const { newPassword, newPassword2 } = formData
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isLoading, isError, isSuccessResetPassword, message } =
    useSelector((state) => state.auth)
  const { person } = useSelector((state) => state.person)

  useEffect(() => {
    if (isError) toast.error(message)
    if (user?.currentPosition.type === "GENERUS") navigate("/")
    dispatch(reset())
  }, [user, isError, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (newPassword !== newPassword2)
      toast.error("Ulangi password tidak sesuai.")
    dispatch(
      tempPassword({
        tempPassword: newPassword,
        resetPasswordToken: person.resetPasswordToken,
      })
    )
  }

  if (isLoading) return <Spinner />

  return (
    <>
      <BackHeader title='Reset Password' />
      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Reset Password
      </Typography>
      <ProfileCard user={person} />

      <Grid>
        <form>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                name='newPassword'
                label='Password baru'
                placeholder='Password baru'
                value={newPassword}
                onChange={onChange}
                type='password'
                variant='outlined'
                fullWidth
                required
                disabled={isSuccessResetPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name='newPassword2'
                label='Ulangi password'
                placeholder='Ulangi password baru'
                value={newPassword2}
                onChange={onChange}
                type='password'
                variant='outlined'
                fullWidth
                required
                disabled={isSuccessResetPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={onSubmit}
                size='large'
                style={{ margin: "20px auto" }}
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                disabled={
                  isSuccessResetPassword || !newPassword || !newPassword2
                }
              >
                Ubah
              </Button>
              {isSuccessResetPassword && (
                <Typography
                  mt={1}
                  align='center'
                  variant='body2'
                  color='#198754'
                >
                  <b>Password berhasil diubah.</b>
                </Typography>
              )}
            </Grid>
          </Grid>
        </form>
      </Grid>
    </>
  )
}

export default ResetPassword
