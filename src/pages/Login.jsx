import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material'

function Login() {
  const [formData, setFormData] = useState({
    phoneOrEmail: '',
    password: ''
  })
  const { phoneOrEmail, password } = formData
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
      if (user.role === 'GENERUS') {
        navigate('/profile')
      } else {
        navigate('/')
      }
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      userData: phoneOrEmail,
      password,
    }

    if (e.currentTarget.id === 'generus') userData.role = 'GENERUS'

    dispatch(login(userData))
  }

  if (isLoading) {
    return <Spinner />
  }

  return <>
    <Typography align='center' variant="h4">
      Login
    </Typography>

    <Grid>
      <Card variant="" style={{ maxWidth: 650, padding: "0 5px", margin: "0 auto" }}>
        <CardContent>
          <form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  name="phoneOrEmail"
                  label="Nomor HP atau Email"
                  placeholder="Nomor HP atau Email"
                  value={phoneOrEmail}
                  onChange={onChange}
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Password"
                  placeholder="Password"
                  value={password}
                  onChange={onChange}
                  type="password"
                  variant="standard"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button id='generus' onClick={onSubmit} size="large" style={{ margin: "20px auto" }} type="submit" variant="contained" color="primary" fullWidth>Masuk Sebagai Generus</Button>
                <Button id='admin' onClick={onSubmit} size="large" style={{ backgroundColor: "#0C0D0E", color:"white", margin: "5px auto" }} type="submit" variant="outlined" fullWidth>Selain Generus</Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Grid>
  </>
}

export default Login