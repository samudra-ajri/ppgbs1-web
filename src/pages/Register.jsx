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
  Checkbox,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import BackHeader from "../components/BackHeader"
import { getPositions } from "../features/positions/positionSlice"
import gradeEnum from "../enums/gradeEnum"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import moment from "moment"

function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
    grade: "",

    muballighStatus: "MT",
    pondok: "",
    kertosonoYear: "",
    firstDutyYear: "",
    timesDuties: 1,
    education: "SD",
    maritalStatus: "SINGLE",
    children: 0,
    job: "",
    hasBpjs: true,
  })
  const [ppd, setPPD] = useState("")
  const [ppk, setPPK] = useState("")
  const [positions, setPositions] = useState([])
  const [hadits, setHadits] = useState([])
  const [scopes, setScopes] = useState([])

  const [assignmentStartDate, setAssignmentStartDate] = useState(moment())
  const handleStartTimeChange = (newValue) => {
    setAssignmentStartDate(newValue)
  }
  const [assignmentFinishDate, setAssignmentFinishDate] = useState(moment())
  const handleFinishTimeChange = (newValue) => {
    setAssignmentFinishDate(newValue)
  }

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
    grade,
    muballighStatus,
    pondok,
    kertosonoYear,
    firstDutyYear,
    timesDuties,
    education,
    maritalStatus,
    children,
    job,
    hasBpjs,
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
    setPositions([])
    dispatch(getppk(ppdId))
  }

  const onChangePPK = (e) => {
    const orgId = e.target.value
    setPPK(orgId)
    setPositions([])
    setFormData((prevState) => ({
      ...prevState,
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
        positionIds: positions
          .filter((position) => position !== "")
          .map((position) => position.id),
        grade,
        muballighStatus,
        pondok,
        kertosonoYear,
        firstDutyYear,
        timesDuties,
        education,
        maritalStatus,
        children,
        job,
        hasBpjs,
        greatHadiths: hadits,
        scopes,
        assignmentStartDate: moment(assignmentStartDate).unix(),
        assignmentFinishDate: moment(assignmentFinishDate).unix(),
      }

      dispatch(register(userData))
    }
  }
  
  const handleKeyDown = (event) => {
    if (event.key === " ") {
      event.preventDefault()
    }
  }

  const haditsOptions = [
    { id: "BUKHORI", type: "Bukhori" },
    { id: "MUSLIM", type: "Muslim" },
    { id: "NASAI", type: "Nasai" },
    { id: "ABU DAWUD", type: "Abu Dawud" },
    { id: "TIRMIDZI", type: "Tirmidzi" },
    { id: "IBNU MAJAH", type: "Ibnu Majah" },
  ]

  const scopeOptions = [
    { id: "KLP", type: "Kelompokan Rutin" },
    { id: "CR", type: "Cabe Rawit" },
    { id: "PR", type: "Pra Remaja" },
    { id: "RM", type: "Remaja" },
    { id: "PN", type: "Pra Nikah" },
    { id: "LANSIA", type: "Lansia" },
    { id: "PRIVATE", type: "Privat" },
    { id: "RAMUTAN", type: "Ramutan" },
  ]

  const handleChangePositions = (event) => {
    const {
      target: { value },
    } = event

    setPositions(value)
  }

  const handleChangeHadits = (event) => {
    const {
      target: { value },
    } = event

    setHadits(typeof value === "string" ? value.split(",") : value)
  }

  const handleChangeScopes = (event) => {
    const {
      target: { value },
    } = event

    setScopes(typeof value === "string" ? value.split(",") : value)
  }

  const isSelected = (item) =>
    positions.some((selectedItem) => selectedItem.id === item.id)

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

                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Posisi</InputLabel>
                      <Select
                        multiple
                        value={positions}
                        onChange={handleChangePositions}
                        input={<OutlinedInput label='Posisi' />}
                        renderValue={(selected) =>
                          selected.map((item) => item.type).join(", ")
                        }
                      >
                        {positionsList ? (
                          positionsList?.data.map((option) => (
                            <MenuItem key={option.id} value={option}>
                              <Checkbox checked={isSelected(option)} />
                              <ListItemText primary={option.type} />
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem></MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  {positions.some(
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

                  {positions.some(
                    (position) => position && position.type === "PENGAJAR"
                  ) && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          name='muballighStatus'
                          label='Status Kemuballighan'
                          placeholder='Status'
                          value={muballighStatus}
                          onChange={onChange}
                          variant='outlined'
                          align='left'
                          select
                          fullWidth
                          required
                        >
                          {[
                            { value: "MT", label: "Tugasan" },
                            { value: "MS", label: "Setempat" },
                            { value: "MSS", label: "Sukarela" },
                          ].map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth required>
                          <InputLabel>Hatam Hadits Besar</InputLabel>
                          <Select
                            multiple
                            value={hadits}
                            onChange={handleChangeHadits}
                            input={<OutlinedInput label='Hatam Hadits Besar' />}
                            renderValue={(selected) => {
                              const selectedTypes = selected
                                .map(
                                  (id) =>
                                    haditsOptions.find((o) => o.id === id)?.type
                                )
                                .filter(Boolean)
                              return selectedTypes.join(", ")
                            }}
                          >
                            {haditsOptions.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                <Checkbox
                                  checked={hadits.includes(option.id)}
                                />
                                <ListItemText primary={option.type} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name='pondok'
                          label='Asal Pondok'
                          placeholder='Asal Pondok'
                          value={pondok}
                          onChange={onChange}
                          variant='outlined'
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name='kertosonoYear'
                          label='Tahun Lulus Tes Muballigh'
                          placeholder='Tahun'
                          value={kertosonoYear}
                          onChange={onChange}
                          variant='outlined'
                          type='number'
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name='firstDutyYear'
                          label='Tahun Pertama Kali Tugasan'
                          placeholder='Tahun'
                          value={firstDutyYear}
                          onChange={onChange}
                          variant='outlined'
                          type='number'
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name='timesDuties'
                          label='Jumlah Pengalaman Tugasan'
                          placeholder='Jumlah'
                          value={timesDuties}
                          onChange={onChange}
                          variant='outlined'
                          type='number'
                          fullWidth
                          required
                        />
                      </Grid>
                      {muballighStatus === "MT" ? (
                        <>
                          <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                name='assignmentStartDate'
                                label='Tahun Mulai Tugasan Saat ini'
                                value={assignmentStartDate}
                                onChange={handleStartTimeChange}
                                views={["year", "month"]}
                                inputFormat='MM/YYYY'
                                renderInput={(params) => (
                                  <TextField {...params} fullWidth />
                                )}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                name='assignmentFinishDate'
                                label='Tahun Selesai Tugasan Saat ini'
                                value={assignmentFinishDate}
                                onChange={handleFinishTimeChange}
                                views={["year", "month"]}
                                inputFormat='MM/YYYY'
                                renderInput={(params) => (
                                  <TextField {...params} fullWidth />
                                )}
                              />
                            </LocalizationProvider>
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}

                      <Grid item xs={12}>
                        <FormControl fullWidth required>
                          <InputLabel>Cakupan Mengajar</InputLabel>
                          <Select
                            multiple
                            value={scopes}
                            onChange={handleChangeScopes}
                            input={<OutlinedInput label='Cakupan Mengajar' />}
                            renderValue={(selected) => {
                              const selectedTypes = selected
                                .map(
                                  (id) =>
                                    scopeOptions.find((o) => o.id === id)?.type
                                )
                                .filter(Boolean)
                              return selectedTypes.join(", ")
                            }}
                          >
                            {scopeOptions.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                <Checkbox
                                  checked={scopes.includes(option.id)}
                                />
                                <ListItemText primary={option.type} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name='education'
                          label='Pendidikan Terakhir'
                          placeholder='Pendidikan'
                          value={education}
                          onChange={onChange}
                          variant='outlined'
                          align='left'
                          select
                          fullWidth
                          required
                        >
                          {[
                            { value: "SD", label: "SD" },
                            { value: "SMP", label: "SMP" },
                            { value: "SMA", label: "SMA" },
                            { value: "SMK", label: "SMK" },
                            { value: "D1", label: "D1" },
                            { value: "D2", label: "D2" },
                            { value: "D3", label: "D3" },
                            { value: "D4", label: "D4" },
                            { value: "S1", label: "S1" },
                            { value: "S2", label: "S2" },
                            { value: "S3", label: "S3" },
                          ].map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name='maritalStatus'
                          label='Status Pernikahan'
                          placeholder='Status'
                          value={maritalStatus}
                          onChange={onChange}
                          variant='outlined'
                          align='left'
                          select
                          fullWidth
                          required
                        >
                          {[
                            { value: "SINGLE", label: "Lajang" },
                            { value: "MARIED", label: "Menikah" },
                            { value: "DIVORCED", label: "Cerai Hidup" },
                            { value: "WIDOWED", label: "Cerai Mati" },
                          ].map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name='children'
                          label='Jumlah Anak'
                          placeholder='Jumlah'
                          value={children}
                          onChange={onChange}
                          variant='outlined'
                          type='number'
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name='job'
                          label='Maisyah Tambahan'
                          placeholder='Maisyah Tambahan'
                          value={job}
                          onChange={onChange}
                          variant='outlined'
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name='hasBpjs'
                          label='Memiliki BPJS'
                          placeholder='Status'
                          value={hasBpjs}
                          onChange={onChange}
                          variant='outlined'
                          align='left'
                          select
                          fullWidth
                          required
                        >
                          {[
                            { value: true, label: "Ya" },
                            { value: false, label: "Tidak" },
                          ].map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </>
                  )}

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
