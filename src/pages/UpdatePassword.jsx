import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { reset, updateMyPassword } from "../features/auth/authSlice"

import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material"

import BackHeader from "../components/BackHeader"

function UpdatePassword() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { isError, isSuccess, message } = useSelector((state) => state.auth)

  const initialFormData = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  }
  const [formData, setFormData] = useState(initialFormData)
  const { currentPassword, newPassword, confirmNewPassword } = formData

  useEffect(() => {
    if (isError) toast.error(message)
    if (isSuccess) toast.success("Update password berhasil.")
    dispatch(reset())
  }, [dispatch, isError, isSuccess, message])

  const onChange = (e) => {
    setFormData((prevState) => {
      const updatedFormData = {
        ...prevState,
        [e.target.name]: e.target.value,
      }
      return updatedFormData
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const userData = { currentPassword, newPassword, confirmNewPassword }
    dispatch(updateMyPassword(userData))
    setFormData(initialFormData)
  }

  const userForms = () => (
    <>
      <Grid item xs={12}>
        <TextField
          name='currentPassword'
          label='Password Saat Ini'
          placeholder='Password Saat Ini'
          value={currentPassword}
          onChange={onChange}
          variant='outlined'
          fullWidth
          required
          type='password'
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name='newPassword'
          label='Password Baru'
          placeholder='Password Baru'
          value={newPassword}
          onChange={onChange}
          variant='outlined'
          fullWidth
          required
          type='password'
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name='confirmNewPassword'
          label='Ulangi Password Baru'
          placeholder='Ulangi Password Baru'
          value={confirmNewPassword}
          onChange={onChange}
          variant='outlined'
          fullWidth
          required
          type='password'
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
          disabled={!currentPassword || !newPassword || !confirmNewPassword}
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
        Ubah Password
      </Typography>

      <Grid>
        <Card variant=''>
          <CardContent>
            <form onSubmit={onSubmit}>
              <Grid container spacing={2}>
                {user.currentPosition.type === "GENERUS" && userForms()}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default UpdatePassword
