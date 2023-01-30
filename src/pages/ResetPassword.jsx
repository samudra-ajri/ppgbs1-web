import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { resetPassword } from "../features/auth/authSlice"
import Spinner from "../components/Spinner"
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import BackHeader from "../components/BackHeader"
import capitalize from "capitalize"

function ResetPassword() {
  const location = useLocation()
  const userName = capitalize.words(location.pathname.split('/')[3].split('-').join(' '))
  const resetPasswordToken = location.pathname.split('/')[4]
  const [formData, setFormData] = useState({ newPassword: '', newPassword2: '' })
  const { newPassword, newPassword2 } = formData
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isLoading, isError, isSuccessResetPassword, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) toast.error(message)
    if (user?.role === 'GENERUS') navigate('/')
  }, [user, isError, message, navigate])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (newPassword !== newPassword2) toast.error('Ulangi password tidak sesuai.')
    dispatch(resetPassword({ newPassword, resetPasswordToken }))
  }

  if (isLoading) return <Spinner />
  return (
    <>
      <BackHeader title='Reset Password' />
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Reset Password</Typography>
      <Typography variant='body1' align='center' sx={{ mb: 1 }}>{userName}</Typography>

      <Grid>
        <Card
          variant=''
          style={{ maxWidth: 650, padding: "0 5px", margin: "0 auto" }}
        >
          <CardContent>
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
                    variant='standard'
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
                    variant='standard'
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
                    disabled={isSuccessResetPassword}
                  >
                    Ubah
                  </Button>
                  {isSuccessResetPassword && (
                    <Typography mt={1} align='center' variant='body2' color='#198754'>
                      <b>Password berhasil diubah.</b>
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default ResetPassword
