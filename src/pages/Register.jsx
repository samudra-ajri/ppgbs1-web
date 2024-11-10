import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { register, reset } from "../features/auth/authSlice"
import { getppd, getppk } from "../features/organizations/organizationSlice"
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
import { getPositions } from "../features/positions/positionSlice"
import gradeEnum from "../enums/gradeEnum"

function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [positionsCount, setPositionsCount] = useState([1])
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    sex: "",
    isMuballigh: "",
    dayBirth: "",
    monthBirth: "",
    yearBirth: "",
    password: "",
    password2: "",
    position1: "",
    position2: "",
    grade: "",
  })
  const [ppd, setPPD] = useState("")
  const [ppk, setPPK] = useState("")

  const {
    name,
    contact,
    sex,
    isMuballigh,
    dayBirth,
    monthBirth,
    yearBirth,
    password,
    password2,
    position1,
    position2,
    grade,
  } = formData

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  const {
    ppd: ppdList,
    ppk: ppkList,
    isError: orgError,
    message: orgMessage,
  } = useSelector((state) => state.organizations)

  const {
    positions: positionsList,
    isError: positionError,
    message: positionMessage,
  } = useSelector((state) => state.positions)

  useEffect(() => {
    if (isError) toast.error(message)
    if (orgError) toast.error(orgMessage)
    if (positionError) toast.error(positionMessage)
    if (user) navigate("/decide-position")
    if (isSuccess) {
      toast.success("Hore! Registrasi berhasil.")
      navigate("/login")
    }
    if (!ppdList) dispatch(getppd())
    dispatch(reset())
  }, [
    user,
    isError,
    orgError,
    positionError,
    isSuccess,
    message,
    orgMessage,
    positionMessage,
    ppdList,
    navigate,
    dispatch,
  ])

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

  const onChangePPD = (e) => {
    const ppdId = e.target.value
    setPPD(ppdId)
    setPPK("")
    dispatch(getppk(ppdId))
  }

  const onChangePPK = (e) => {
    const orgId = e.target.value
    setPPK(orgId)
    setFormData((prevState) => ({
      ...prevState,
      position1: "",
      position2: "",
      grade: "",
    }))
    dispatch(getPositions(orgId))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (password !== password2) {
      toast.error("Konfirmasi password tidak sesuai")
    } else {
      const month = monthBirth.toString().padStart(2, "0")
      const day = dayBirth.toString().padStart(2, "0")
      const userData = {
        name,
        contact,
        sex,
        isMuballigh,
        birthdate: `${yearBirth}-${month}-${day}`,
        password,
        password2,
        positionIds: [position1, position2]
          .filter((position) => position !== "")
          .map((position) => position.id),
        grade,
      }

      dispatch(register(userData))
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === " ") {
      event.preventDefault()
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
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name='name'
                      label='Nama Lengkap'
                      placeholder='Nama'
                      value={name}
                      onChange={onChange}
                      variant='outlined'
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='contact'
                      label='Daftar dengan nomor HP, email, atau username'
                      placeholder='Nomor HP, email, atau username'
                      value={contact}
                      onChange={onChange}
                      variant='outlined'
                      fullWidth
                      required
                      onKeyDown={handleKeyDown}
                      inputProps={{ pattern: "[^\\s]*" }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='sex'
                      label='Gender'
                      placeholder='Gender'
                      value={sex}
                      onChange={onChange}
                      variant='outlined'
                      align='left'
                      select
                      fullWidth
                      required
                    >
                      {[
                        { value: 1, label: "Laki-Laki" },
                        { value: 0, label: "Perempuan" },
                      ].map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='isMuballigh'
                      label='Muballigh'
                      placeholder='Muballigh'
                      value={isMuballigh}
                      onChange={onChange}
                      variant='outlined'
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
                      variant='outlined'
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
                      variant='outlined'
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
                      variant='outlined'
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='ppd'
                      label='PPD'
                      placeholder='PPD'
                      value={ppd}
                      onChange={onChangePPD}
                      variant='outlined'
                      align='left'
                      select
                      fullWidth
                      required
                    >
                      {ppdList?.data.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name.replace("PPD ", "")}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='ppk'
                      label='PPK'
                      placeholder='PPK'
                      value={ppk}
                      onChange={onChangePPK}
                      variant='outlined'
                      align='left'
                      disabled={ppkList ? false : true}
                      select
                      fullWidth
                      required
                    >
                      {ppkList ? (
                        ppkList?.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name.replace("PPK ", "")}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem></MenuItem>
                      )}
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
                      variant='outlined'
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
                      variant='outlined'
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
                        variant='outlined'
                        align='left'
                        select
                        fullWidth
                        required
                      >
                        {positionsList ? (
                          positionsList?.data.map((option) => (
                            <MenuItem key={option.id} value={option}>
                              {option.type}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem></MenuItem>
                        )}
                      </TextField>
                    </Grid>
                  ))}

                  {[position1, position2].some(
                    (position) => position && position.type === "GENERUS"
                  ) && (
                    <Grid item xs={12}>
                      <TextField
                        name='grade'
                        label='Kelas'
                        placeholder='Kelas'
                        value={grade}
                        onChange={onChange}
                        variant='outlined'
                        align='left'
                        select
                        fullWidth
                        required
                      >
                        {Object.keys(gradeEnum).map((option) => (
                          <MenuItem key={option} value={option}>
                            {gradeEnum[option]}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Button
                      size='medium'
                      // style={{ margin: "20px auto" }}
                      variant='outlined'
                      color='inherit'
                      disabled={positionsCount.length < 2}
                      onClick={removePositionForm}
                      fullWidth
                    >
                      Kurangi Posisi
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      size='medium'
                      // style={{ margin: "20px 5px" }}
                      variant='outlined'
                      color='inherit'
                      disabled={positionsCount.length >= 2}
                      onClick={addPositionForm}
                      fullWidth
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
