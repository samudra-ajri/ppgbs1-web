import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { register, reset } from "../features/auth/authSlice"
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material"
import BackHeader from "../components/BackHeader"

function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [positionsCount, setPositionsCount] = useState([1])
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    sex: "",
    isMuballigh: "",
    dayBirth: "",
    monthBirth: "",
    yearBirth: "",
    password: "",
    password2: "",
    position1: "",
    position2: "",
  })

  const {
    name,
    phone,
    sex,
    isMuballigh,
    dayBirth,
    monthBirth,
    yearBirth,
    password,
    password2,
    position1,
    position2,
  } = formData

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) toast.error(message)
    if (isSuccess || user) navigate("/decide-position")
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const addPositionForm = () => {
    setPositionsCount([...positionsCount, positionsCount.length + 1])
  }

  const removePositionForm = () => {
    const updatedPositions = [...positionsCount]
    updatedPositions.pop()
    setPositionsCount(updatedPositions)
    setFormData((prevData) => ({ ...prevData, position2: "" }))
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (password !== password2) {
      toast.error("Konfirmasi password tidak sesuai")
    } else {
      const userData = {
        name,
        phone,
        sex,
        isMuballigh,
        dayBirth,
        monthBirth,
        yearBirth,
        password,
        positionIds: [position1, position2],
      }

      dispatch(register(userData))
    }
  }

  return (
    <>
      <BackHeader title={"Login"} />
      <Typography align='center' variant='h4'>
        Buat Akun
      </Typography>

      <Grid>
        <Card
          variant=''
          style={{ maxWidth: 650, padding: "0 5px", margin: "0 auto" }}
        >
          {isLoading ? (
            <Grid align='center' sx={{ pt: 5 }}>
              <CircularProgress />
            </Grid>
          ) : (
            <CardContent>
              <form onSubmit={onSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      name='name'
                      label='Nama Lengkap'
                      placeholder='Nama'
                      value={name}
                      onChange={onChange}
                      variant='standard'
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='phone'
                      label='Nomor HP'
                      placeholder='Nomor HP'
                      value={phone}
                      onChange={onChange}
                      variant='standard'
                      type='number'
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name='sex'
                      label='Gender'
                      placeholder='Gender'
                      value={sex}
                      onChange={onChange}
                      variant='standard'
                      align='left'
                      select
                      fullWidth
                      required
                    >
                      {[
                        { value: "male", label: "Laki-Laki" },
                        { value: "female", label: "Perempuan" },
                      ].map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name='isMuballigh'
                      label='Muballigh'
                      placeholder='Muballigh'
                      value={isMuballigh}
                      onChange={onChange}
                      variant='standard'
                      align='left'
                      select
                      fullWidth
                      required
                    >
                      {[
                        { value: true, label: "Sudah" },
                        { value: false, label: "Belum" },
                      ].map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid xs={12} sm={4} item>
                    <TextField
                      name='dayBirth'
                      placeholder='Tanggal'
                      label='Tgl Lahir'
                      value={dayBirth}
                      onChange={onChange}
                      variant='standard'
                      align='left'
                      select
                      fullWidth
                      required
                    >
                      {Array.from(Array(31))
                        .map((_, i) => i + 1)
                        .map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid xs={12} sm={4} item>
                    <TextField
                      name='monthBirth'
                      placeholder='Bulan'
                      label='Bulan Lahir'
                      value={monthBirth}
                      onChange={onChange}
                      variant='standard'
                      align='left'
                      select
                      fullWidth
                      required
                    >
                      {Array.from(Array(12))
                        .map((_, i) => i + 1)
                        .map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid xs={12} sm={4} item>
                    <TextField
                      name='yearBirth'
                      label='Tahun Lahir'
                      placeholder='Tahun'
                      value={yearBirth}
                      onChange={onChange}
                      type='number'
                      variant='standard'
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='ds'
                      label='Ds'
                      placeholder='Ds'
                      value={sex}
                      onChange={onChange}
                      variant='standard'
                      align='left'
                      select
                      fullWidth
                      required
                    >
                      {[
                        { value: "GENERUS", label: "Generus" },
                        { value: "PENGAJAR", label: "Pengajar" },
                      ].map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='klp'
                      label='Klp'
                      placeholder='Klp'
                      value={sex}
                      onChange={onChange}
                      variant='standard'
                      align='left'
                      select
                      fullWidth
                      required
                    >
                      {[
                        { value: "GENERUS", label: "Generus" },
                        { value: "PENGAJAR", label: "Pengajar" },
                      ].map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='password'
                      label='Buat Password'
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
                    <TextField
                      name='password2'
                      label='Ulangi Password'
                      placeholder='Password'
                      value={password2}
                      onChange={onChange}
                      type='password'
                      variant='standard'
                      fullWidth
                      required
                    />
                  </Grid>

                  {positionsCount.map((_, index) => (
                    <Grid item xs={12} key={index}>
                      <TextField
                        name={`position${index + 1}`}
                        label={`Posisi ${index === 0 ? "" : index + 1}`}
                        placeholder={`Posisi ${index + 1}`}
                        value={formData[`position${index + 1}`]}
                        onChange={onChange}
                        variant='standard'
                        align='left'
                        select
                        fullWidth
                        required
                      >
                        {[
                          { value: "GENERUS", label: "Generus" },
                          { value: "PENGAJAR", label: "Pengajar" },
                        ].map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  ))}

                  <Grid item xs={4}>
                    <Button
                      size='medium'
                      style={{ margin: "20px auto" }}
                      variant='contained'
                      color='inherit'
                      disabled={positionsCount.length < 2}
                      onClick={removePositionForm}
                    >
                      Kurangi Posisi
                    </Button>
                  </Grid>

                  <Grid item xs={4}>
                    <Button
                      size='medium'
                      style={{ margin: "20px 5px" }}
                      variant='contained'
                      color='inherit'
                      disabled={positionsCount.length >= 2}
                      onClick={addPositionForm}
                    >
                      Tambah Posisi
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      size='large'
                      style={{ margin: "20px auto" }}
                      type='submit'
                      variant='contained'
                      color='primary'
                      fullWidth
                    >
                      Daftar
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          )}
        </Card>
      </Grid>
    </>
  )
}

export default Register
