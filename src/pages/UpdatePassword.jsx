import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { reset, updateMyPassword } from "../features/auth/authSlice"
import { Button, Grid, TextField, Typography } from "@mui/material"

import BackHeader from "../components/BackHeader"
import { useNavigate } from "react-router-dom"

function UpdatePassword() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  const initialFormData = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  }
  const [formData, setFormData] = useState(initialFormData)
  const { currentPassword, newPassword, confirmNewPassword } = formData

  const isChangeTempPassword =
    user.needUpdatePassword && user.resetPasswordToken

  useEffect(() => {
    if (isError) toast.error(message)
    if (isSuccess) {
      toast.success("Update password berhasil.")
      navigate("/profile")
    }
    return () => {
      dispatch(reset())
    }
  }, [dispatch, isError, isSuccess, message, navigate])

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
    const userData = {
      positionId: user.currentPosition.positionId,
      currentPassword,
      newPassword,
      confirmNewPassword,
    }
    dispatch(updateMyPassword(userData))
    setFormData(initialFormData)
  }

  const contentForms = () => (
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
        Update Password
      </Typography>

      <Grid>
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            {isChangeTempPassword && (
              <Grid item>
                <Typography variant='body2' color='#01579B'>
                  Anda baru saja login menggunakan Password Sementara. Silakan
                  lakukan update password sebelum melanjutkan.
                </Typography>
              </Grid>
            )}
            {contentForms()}
          </Grid>
        </form>
      </Grid>
    </>
  )
}

export default UpdatePassword
