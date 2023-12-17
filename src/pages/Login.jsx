import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { login, reset } from "../features/auth/authSlice"
import { reset as resetCompletionScore } from "../features/completionScores/completionScoreSlice"
import Spinner from "../components/Spinner"
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material"

function Login() {
  const [formData, setFormData] = useState({
    phoneOrEmail: "",
    password: "",
  })
  const { phoneOrEmail, password } = formData
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) toast.error(message)
    if (isSuccess || user) navigate("/decide-position")
    dispatch(reset())
    dispatch(resetCompletionScore())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const userData = {
      login: phoneOrEmail,
      password,
    }
    dispatch(login(userData))
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <Typography align='center' variant='h4'>
        Login
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name='password'
                    label='Password'
                    placeholder='Password'
                    value={password}
                    onChange={onChange}
                    type='password'
                    variant='standard'
                    fullWidth
                    required
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
                  >
                    Masuk
                  </Button>
                  <Link to='/forgot-password'>
                    <Typography
                      mt={1}
                      align='center'
                      variant='subtitle1'
                      color='#1D9BF0'
                    >
                      Lupa password?
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default Login
