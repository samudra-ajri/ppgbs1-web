import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import validator from 'email-validator'
import Spinner from '../components/Spinner'
import { register, reset } from '../features/auth/authSlice'
import { Button, Card, CardContent, Grid, MenuItem, TextField, Typography } from '@mui/material'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    dayBirth: '',
    monthBirth: '',
    yearBirth: '',
    registerType: '',
    password: '',
    password2: '',
    sex: '',
    isMuballigh: '',
    ds: '',
    klp: ''
  })
  const { 
    name, 
    dayBirth, 
    monthBirth, 
    yearBirth, 
    registerType, 
    password, 
    password2,
    sex,
    isMuballigh,
    ds,
    klp
  } = formData
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
      navigate('/')
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
    console.log(monthBirth);
    e.preventDefault()
    if (password !== password2) {
      toast.error('Konfirmasi password tidak sesuai')
    } else {
      const userData = {
        name,
        password,
        dayBirth,
        monthBirth,
        yearBirth,
        sex,
        isMuballigh,
        ds,
        klp
      }

      if (validator.validate(registerType)) {
        userData.email = registerType
      } else if (/^\d+$/.test(registerType)) {
        userData.phone = registerType
      }

      dispatch(register(userData))
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <Typography variant="h4">
        Buat Akun
      </Typography>

      <Grid>
        <Card variant="" style={{ maxWidth: 650, padding: "0 5px", margin: "0 auto" }}>
          <CardContent>
            <form onSubmit={onSubmit}>
              <Grid container spacing={1}>
              <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Nama Lengkap"
                    placeholder="Nama"
                    value={name}
                    onChange={onChange}
                    variant="standard"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="registerType"
                    label="Nomor HP atau Email"
                    placeholder="Nomor HP atau Email"
                    value={registerType}
                    onChange={onChange}
                    variant="standard"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField
                    name="ds"
                    placeholder="Ds"
                    label="Ds"
                    value={ds}
                    onChange={onChange}
                    variant="standard"
                    align="left"
                    select
                    fullWidth
                    required
                  >
                    {["Buahbatu", "Margahayu", "Regol", "Riung Bandung", "Tegalega"].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField
                    name="klp"
                    placeholder="Klp"
                    label="Klp"
                    value={klp}
                    onChange={onChange}
                    variant="standard"
                    align="left"
                    select
                    fullWidth
                    required
                  >
                    {["MRB", "MRU", "MRS"].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="sex"
                    label="Gender"
                    placeholder="Gender"
                    value={sex}
                    onChange={onChange}
                    variant="standard"
                    align="left"
                    select
                    fullWidth
                    required
                  >
                    {[{ value: 'male', label: 'Laki-Laki' }, { value: 'female', label: 'Perempuan' }].map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="isMuballigh"
                    label="Muballigh"
                    placeholder="Muballigh"
                    value={isMuballigh}
                    onChange={onChange}
                    variant="standard"
                    align="left"
                    select
                    fullWidth
                    required
                  >
                    {[{ value: true, label: 'Sudah' }, { value: false, label: 'Belum' }].map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid xs={12} sm={4} item>
                  <TextField
                    name="dayBirth"
                    placeholder="Tanggal"
                    label="Tgl Lahir"
                    value={dayBirth}
                    onChange={onChange}
                    variant="standard"
                    align="left"
                    select
                    fullWidth
                    required
                  >
                    {Array.from(Array(31)).map((_, i) => i + 1).map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid xs={12} sm={4} item>
                  <TextField
                    name="monthBirth"
                    placeholder="Bulan"
                    label="Bulan Lahir"
                    value={monthBirth}
                    onChange={onChange}
                    variant="standard"
                    align="left"
                    select
                    fullWidth
                    required
                  >
                    {Array.from(Array(12)).map((_, i) => i + 1).map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid xs={12} sm={4} item>
                  <TextField
                    name="yearBirth"
                    label="Tahun Lahir"
                    placeholder="Tahun"
                    value={yearBirth}
                    onChange={onChange}
                    type="number"
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
                  <TextField
                    name="password2"
                    label="Konfirmasi Password"
                    placeholder="Password"
                    value={password2}
                    onChange={onChange}
                    type="password"
                    variant="standard"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button style={{ margin: "20px auto" }} type="submit" variant="contained" color="primary" fullWidth>Daftar</Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default Register