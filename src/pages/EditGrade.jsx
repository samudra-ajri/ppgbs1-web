import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { reset, updateStudentProfile } from "../features/auth/authSlice"

import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material"

import BackHeader from "../components/BackHeader"
import gradeEnum from "../enums/gradeEnum"
import { updateStudentByAdmin } from "../features/persons/personSlice"

function EditGrade() {
  const dispatch = useDispatch()
  const { user: session } = useSelector((state) => state.auth)
  const { person } = useSelector((state) => state.person)
  const { isError, isSuccess, message } = useSelector((state) => state.auth)

  let user = session
  if (session.currentPosition?.type !== "GENERUS") {
    user = {
      ...person,
      currentPosition: person.positions.find(
        (position) => position.type === "GENERUS"
      ),
    }
  }

  const initialFormData = { grade: user.grade }
  const [formData, setFormData] = useState(initialFormData)
  const [isFormChanged, setIsFormChanged] = useState(false)
  const { grade } = formData

  useEffect(() => {
    if (isError) toast.error(message)
    if (isSuccess) toast.success("Update profile berhasil.")
    dispatch(reset())
  }, [dispatch, isError, isSuccess, message])

  const checkFormChange = (newFormData) => {
    const hasChanged = Object.keys(initialFormData).some(
      (key) => initialFormData[key] !== Number(newFormData[key])
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

  const onSubmit = (e) => {
    e.preventDefault()
    const userData = { grade }
    if (session.currentPosition?.type !== "GENERUS") {
      dispatch(updateStudentByAdmin({ userId: user.id, payload: userData }))
    } else {
      dispatch(updateStudentProfile(userData))
    }
    setIsFormChanged(false)
  }

  const userForms = () => (
    <>
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
        {session.currentPosition?.type !== "GENERUS" ? user.name : "Kelas"}
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

export default EditGrade
