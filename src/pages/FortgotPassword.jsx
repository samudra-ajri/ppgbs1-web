import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { forgotPassword, reset } from "../features/auth/authSlice"
import Spinner from "../components/Spinner"
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material"

function FortgotPassword() {
  const [formData, setFormData] = useState({ phoneOrEmail: "" })
  const { phoneOrEmail } = formData
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isLoading, isError, isSuccessForgotPassword, message } =
    useSelector((state) => state.auth)

  useEffect(() => {
    if (isError) toast.error(message)
    if (user) {
      if (user.role === "GENERUS") navigate("/user-completion")
      navigate("/")
    }
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
    const userData = { login: phoneOrEmail }
    dispatch(forgotPassword(userData))
  }

  if (isLoading) return <Spinner />
  return (
    <>
      <Typography align='center' variant='h4'>
        Lupa Password
      </Typography>

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
                    name='phoneOrEmail'
                    label='Nomor HP, email, atau username'
                    placeholder='Nomor HP, email, atau username'
                    value={phoneOrEmail}
                    onChange={onChange}
                    variant='outlined'
                    fullWidth
                    required
                    disabled={isSuccessForgotPassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    id='generus'
                    onClick={onSubmit}
                    size='large'
                    style={{ margin: "20px auto" }}
                    type='submit'
                    variant='contained'
                    color='primary'
                    fullWidth
                    disabled={isSuccessForgotPassword || !phoneOrEmail}
                  >
                    Mohon Reset Password
                  </Button>
                  {isSuccessForgotPassword && (
                    <>
                      <Typography
                        mt={1}
                        align='center'
                        variant='body2'
                        color='#198754'
                      >
                        <b>Permohonan berhasil.</b>
                      </Typography>
                      <Typography mt={1} align='center' variant='body2'>
                        Silakan hubungi pengurus PPD/PPK untuk mendapatkan
                        password sementara.
                      </Typography>
                    </>
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

export default FortgotPassword
