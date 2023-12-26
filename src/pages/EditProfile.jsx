import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { update, reset } from "../features/auth/authSlice"
import { getppd, getppk } from "../features/organizations/organizationSlice"
import { getPositions } from "../features/positions/positionSlice"

import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material"

import moment from "moment"
import BackHeader from "../components/BackHeader"

function EditProfile() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const { isError, isSuccess, message } = useSelector((state) => state.auth)

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

  const [isFormChanged, setIsFormChanged] = useState(false)

  const initialFormData = {
    name: user.name,
    dayBirth: moment(user.birthdate).date(),
    monthBirth: moment(user.birthdate).month() + 1,
    yearBirth: moment(user.birthdate).year(),
    phone: user.phone || "",
    email: user.email || "",
    sex: user.sex,
    isMuballigh: user.isMuballigh,
    currentPositionId: user.currentPosition.positionId,
  }
  const [formData, setFormData] = useState(initialFormData)

  const initialPpdData = user.currentPosition.organizationAncestorId
  const initialPpkData = user.currentPosition.organizationId
  const [ppd, setPPD] = useState(initialPpdData)
  const [ppk, setPPK] = useState(initialPpkData)

  const {
    name,
    dayBirth,
    monthBirth,
    yearBirth,
    phone,
    email,
    sex,
    isMuballigh,
    currentPositionId,
  } = formData

  useEffect(() => {
    if (isError) toast.error(message)
    if (orgError) toast.error(orgMessage)
    if (positionError) toast.error(positionMessage)
    if (isSuccess) toast.success("Update profile berhasil.")
    dispatch(getppd())
    dispatch(getppk(user.currentPosition.organizationId))
    dispatch(reset())
  }, [
    user.currentPosition.organizationId,
    isError,
    isSuccess,
    message,
    dispatch,
    orgError,
    orgMessage,
    positionError,
    positionMessage,
  ])

  const checkFormChange = (newFormData) => {
    const hasChanged = Object.keys(initialFormData).some(
      (key) => initialFormData[key] !== newFormData[key]
    )
    setIsFormChanged(hasChanged)
  }

  const onChange = (e) => {
    setFormData((prevState) => {
      const updatedFormData = {
        ...prevState,
        [e.target.name]: e.target.value,
      }
      checkFormChange(updatedFormData)
      return updatedFormData
    })
  }

  const onChangePPD = (e) => {
    const ppdId = e.target.value
    setPPD(ppdId)
    setPPK("")
    dispatch(getppk(ppdId))

    const hasChanged = ppdId !== initialPpdData
    setIsFormChanged(hasChanged)
  }

  const onChangePPK = (e) => {
    const orgId = e.target.value
    setPPK(orgId)
    dispatch(getPositions(orgId))

    const hasChanged = orgId !== initialPpkData
    setIsFormChanged(hasChanged)
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const newPosition = positionsList?.data.find(
      (position) => position.type === user.currentPosition.type
    )
    const month = monthBirth.toString().padStart(2, "0")
    const day = dayBirth.toString().padStart(2, "0")
    const userData = {
      name,
      sex,
      email,
      isMuballigh,
      birthdate: `${yearBirth}-${month}-${day}`,
      currentPositionId,
      newPositionId: newPosition ? Number(newPosition.id) : currentPositionId,
    }

    dispatch(update(userData))
    setIsFormChanged(false)
  }

  const adminForms = () => (
    <Grid item xs={12}>
      <TextField
        name='name'
        label='Nama'
        placeholder='Nama'
        value={name}
        onChange={onChange}
        variant='outlined'
        fullWidth
        required
        disabled
      />
    </Grid>
  )

  const userForms = () => (
    <>
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
          name='phone'
          label='Nomor HP'
          placeholder='Nomor HP'
          value={phone}
          onChange={onChange}
          variant='outlined'
          fullWidth
          disabled={user.phone ? true : false}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name='email'
          label='Email'
          placeholder='Email'
          value={email}
          onChange={onChange}
          variant='outlined'
          fullWidth
          disabled={user.email ? true : false}
        />
      </Grid>
      <Grid xs={12} sm={6} item>
        <TextField
          name='ppd'
          placeholder='PPD'
          label='PPD'
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
      <Grid xs={12} sm={6} item>
        <TextField
          name='ppk'
          placeholder='PPK'
          label='PPK'
          value={ppk}
          onChange={onChangePPK}
          variant='outlined'
          align='left'
          disabled={ppkList ? false : true}
          select
          fullWidth
          required
        >
          {ppkList &&
            ppkList?.data.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name.replace("PPK ", "")}
              </MenuItem>
            ))}
        </TextField>
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
        <Button
          size='large'
          style={{ margin: "20px auto" }}
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          disabled={!isFormChanged}
        >
          Ubah
        </Button>
      </Grid>
    </>
  )

  return (
    <>
      <BackHeader title='Profile' />
      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Biodata
      </Typography>

      <Grid>
        <Card variant=''>
          <CardContent>
            <form onSubmit={onSubmit}>
              <Grid container spacing={2}>
                {user.currentPosition.type === "ADMIN" && adminForms()}
                {(user.currentPosition.type === "GENERUS" ||
                  user.currentPosition.type === "PENGAJAR") &&
                  userForms()}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default EditProfile
