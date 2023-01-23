import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { login, reset } from "../features/auth/authSlice"
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
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      if (user.role === "GENERUS") {
        navigate("/profile")
      } else {
        navigate("/")
      }
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const userData = { userData: phoneOrEmail }
    dispatch(login(userData))
  }

  if (isLoading) {
    return <Spinner />
  }

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
                    label='Nomor HP atau Email'
                    placeholder='Nomor HP atau Email'
                    value={phoneOrEmail}
                    onChange={onChange}
                    variant='standard'
                    fullWidth
                    required
                    disabled={isSuccess}
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
                    disabled={isSuccess}
                  >
                    Mohon Reset Password
                  </Button>
                  {isSuccess && (
                    <Typography mt={1} align='center' variant='subtitle1'>
                      Permohonan berhasil. Silakan hubungi pengurus PPD/PPK untuk mengetahui password baru.
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

export default FortgotPassword
