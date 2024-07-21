import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { registerByAdmin, reset } from "../features/auth/authSlice"
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

function RegisterByAdmin() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    sex: "",
    dayBirth: "",
    monthBirth: "",
    yearBirth: "",
    grade: 0,
  })
  const [ppd, setPPD] = useState("")
  const [ppk, setPPK] = useState("")

  const { name, username, sex, dayBirth, monthBirth, yearBirth, grade } = formData

  const { user, isLoading, isError, isSuccessRegisterByAdmin, message } =
    useSelector((state) => state.auth)

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
    if (!user) navigate("/login")
    if (isSuccessRegisterByAdmin) {
      toast.success("Berhasil ditambahkan.")
      navigate("/users")
    }
    if (!ppdList) dispatch(getppd())
    dispatch(reset())
  }, [
    user,
    isError,
    orgError,
    positionError,
    isSuccessRegisterByAdmin,
    message,
    orgMessage,
    positionMessage,
    ppdList,
    navigate,
    dispatch,
  ])

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
    dispatch(getPositions(orgId))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const month = monthBirth.toString().padStart(2, "0")
    const day = dayBirth.toString().padStart(2, "0")
    const position = positionsList?.data.find((item) => item.type === "GENERUS")
    const userData = {
      name,
      username,
      sex,
      birthdate: `${yearBirth}-${month}-${day}`,
      positionIds: [position.id],
      grade,
    }

    dispatch(registerByAdmin(userData))
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
        Tambah Generus
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
                      name='username'
                      label='Username'
                      placeholder='Username tanpa spasi'
                      value={username}
                      onChange={onChange}
                      variant='outlined'
                      type='text'
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

export default RegisterByAdmin
