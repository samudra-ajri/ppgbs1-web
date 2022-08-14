import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import validator from 'email-validator'
import { register, reset } from '../features/auth/authSlice'
import { getLocations } from '../features/locations/locationSlice'
import { Button, Card, CardContent, Checkbox, CircularProgress, FormControlLabel, Grid, MenuItem, TextField, Typography } from '@mui/material'
import BackHeader from '../components/BackHeader'
import capitalize from 'capitalize'

function Register() {
  const path = window.location.pathname.split('/')
  const title = path[3]

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
    // Addition for muballigh data
    hometown: '',
    isMarried: '',
    pondok: '',
    kertosonoYear: '',
    firstDutyYear: '',
    timesDuties: '',
    education: '',
    role: ''
  })
  const [ds, setDs] = useState('')
  const [klp, setKlp] = useState('')
  const [greatHadiths, setGreatHadiths] = useState([]);
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
    // Addition for muballigh data
    hometown,
    isMarried,
    pondok,
    kertosonoYear,
    firstDutyYear,
    timesDuties,
    education,
    role
  } = formData
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )
  const { locations, isLoading: isLoadingLocations } = useSelector(
    (state) => state.locations
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

    dispatch(getLocations())
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    if (e.target.name === 'ds') {
      setKlp('')
      setDs(e.target.value)
    }

    if (e.target.name === 'klp') {
      setKlp(e.target.value)
    }

    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const onSelect = (e) => {
    let hadiths = greatHadiths
    if (!hadiths.includes(e.target.name)) {
      setGreatHadiths((prev => [...prev, e.target.name]))
    } else {
      setGreatHadiths(hadiths.filter(hadith => hadith !== e.target.name))
    }
  }

  const onSubmit = (e) => {
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

      if (title !== 'generus') {
        Object.assign(userData, {
          isMuballigh: true,
          hometown,
          isMarried,
          pondok,
          kertosonoYear,
          firstDutyYear,
          timesDuties,
          greatHadiths,
          education,
          role
        });
      }

      if (validator.validate(registerType)) {
        userData.email = registerType
      } else if (/^\d+$/.test(registerType)) {
        userData.phone = registerType
      }

      dispatch(register(userData))
    }
  }

  const dsLocationsOptions = (locations) => {
    if (locations.length !== 0) return locations.locations
    return []
  }

  const klpLocationsOptions = (locations, ds) => {
    let klp = []
    let i = 0
    if (ds) {
      while (klp.length === 0) {
        if (locations.locations[i].ds === ds) {
          klp = locations.locations[i].klp
        }
        i += 1
      }
    }
    return klp
  }

  const hadiths = [
    'BUKHORI',
    'MUSLIM',
    'ABUDAWUD',
    'NASAI',
    'TIRMIDZI',
    'IBNUMAJAH'
  ];

  return (
    <>
      <BackHeader title={'Registrasi ' + title} />
      <Typography align='center' variant="h4">
        Buat Akun
      </Typography>

      <Grid>
        <Card variant="" style={{ maxWidth: 650, padding: "0 5px", margin: "0 auto" }}>
          {isLoading || isLoadingLocations ? (
            <Grid align="center" sx={{ pt: 5 }}>
              <CircularProgress />
            </Grid>
          ) : (
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
                      {dsLocationsOptions(locations).map((location) => (
                        <MenuItem key={location.ds} value={location.ds}>
                          {location.ds}
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
                      disabled={!ds ?? true}
                    >
                      {klpLocationsOptions(locations, ds).map((klp) => (
                        <MenuItem key={klp} value={klp}>
                          {klp}
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
                  {title !== 'muballigh' ?
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
                    </Grid> :
                    <Grid item xs={6}>
                      <TextField
                        name="isMarried"
                        label="Menikah"
                        placeholder="Menikah"
                        value={isMarried}
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
                  }

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
                  {title === 'muballigh' && (<>
                    <Grid item xs={12}>
                      <TextField
                        name="hometown"
                        label="Kampung Halaman"
                        placeholder="Kampung Halaman"
                        value={hometown}
                        onChange={onChange}
                        variant="standard"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="role"
                        label="Kemubaliighan"
                        placeholder="Status"
                        value={role}
                        onChange={onChange}
                        variant="standard"
                        align="left"
                        select
                        fullWidth
                        required
                      >
                        {['MT', 'MS'].map((option) => (
                          <MenuItem key={option} value={option}>
                            {'Muballigh ' + (option === 'MT' ? 'Tugasan' : 'Setempat')}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="pondok"
                        label="Pondok"
                        placeholder="Asal Pondok"
                        value={pondok}
                        onChange={onChange}
                        variant="standard"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="kertosonoYear"
                        label="Lulus Kertosono"
                        placeholder="Tahun"
                        value={kertosonoYear}
                        onChange={onChange}
                        type="number"
                        variant="standard"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="firstDutyYear"
                        label="Pertama Tugas"
                        placeholder="Tahun"
                        value={firstDutyYear}
                        onChange={onChange}
                        type="number"
                        variant="standard"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="education"
                        label="Pendidikan Formal"
                        placeholder="Pendidikan Formal Terakhir"
                        value={education}
                        onChange={onChange}
                        variant="standard"
                        align="left"
                        select
                        fullWidth
                        required
                      >
                        {['SD', 'SMP', 'SMA', 'SMK', 'DIPLOMA', 'S1', 'S2', 'S3'].map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                      name="greatHadiths"
                      label="Hadits Besar *"
                      value={greatHadiths}
                      variant="standard"
                      align="left"
                      fullWidth
                      disabled
                    />
                      {hadiths.map(hadith => (
                        <FormControlLabel 
                          key={hadith}
                          control={
                            <Checkbox 
                              name={hadith}
                              checked={greatHadiths.includes(hadith)}
                              onChange={onSelect}
                            />
                          } 
                          label={capitalize(hadith)}
                        />
                      ))}
                    </Grid>
                  </>)}
                  <Grid item xs={12}>
                    <TextField
                      name="password"
                      label="Buat Password"
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
                      label="Ulangi Password"
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
                    <Button size="large" style={{ margin: "20px auto" }} type="submit" variant="contained" color="primary" fullWidth>Daftar</Button>
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