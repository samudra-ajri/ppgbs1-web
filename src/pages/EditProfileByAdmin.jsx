import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { reset, updateStudentProfile } from "../features/auth/authSlice"
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

import BackHeader from "../components/BackHeader"
import gradeEnum from "../enums/gradeEnum"
import {
  getUserById,
  resetStatus,
  updateStudentByAdmin,
} from "../features/persons/personSlice"

function EditProfileByAdmin() {
  const dispatch = useDispatch()
  const { user: session } = useSelector((state) => state.auth)
  const { isError, isSuccess, message } = useSelector((state) => state.auth)
  const {
    person,
    isSuccess: isPersonSuccess,
    isError: isPersonError,
    message: personMessage,
  } = useSelector((state) => state.person)

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

  let user = session
  if (session.currentPosition?.type !== "GENERUS") {
    user = {
      ...person,
      currentPosition: person.positions.find(
        (position) => position.type === "GENERUS",
      ),
    }
  }

  const initialFormData = { grade: user.grade }
  const [formData, setFormData] = useState(initialFormData)
  const [isFormChanged, setIsFormChanged] = useState(false)
  const { grade } = formData

  const initialPpdData = user.currentPosition.ancestorOrgId
  const initialPpkData = user.currentPosition.organizationId
  const [ppd, setPPD] = useState(initialPpdData)
  const [ppk, setPPK] = useState(initialPpkData)

  useEffect(() => {
    dispatch(getppd())
    dispatch(getppk(user.currentPosition.ancestorOrgId))
    dispatch(reset())

    return () => {
      dispatch(resetStatus())
    }
  }, [dispatch, user.currentPosition.ancestorOrgId])

  useEffect(() => {
    if (isError) {
      toast.error(message)
      dispatch(reset())
    }
    if (isPersonError) toast.error(personMessage)
    if (orgError) toast.error(orgMessage)
    if (positionError) toast.error(positionMessage)

    if (isSuccess) {
      toast.success("Update profile berhasil.")
      dispatch(reset())
    }
    if (isPersonSuccess) {
      dispatch(getUserById(user.id))
    }
  }, [
    dispatch,
    isError,
    isSuccess,
    isPersonError,
    isPersonSuccess,
    message,
    personMessage,
    orgError,
    orgMessage,
    positionError,
    positionMessage,
    user.id,
  ])

  const checkFormChange = (newFormData, newPpk) => {
    const gradeChanged = Object.keys(initialFormData).some(
      (key) => initialFormData[key] !== Number(newFormData[key]),
    )
    const ppkChanged = newPpk !== initialPpkData
    setIsFormChanged(gradeChanged || ppkChanged)
  }

  const onChange = (e) => {
    setFormData((prevState) => {
      const updatedFormData = {
        ...prevState,
        [e.target.name]: e.target.value,
      }
      checkFormChange(updatedFormData, ppk)
      return updatedFormData
    })
  }

  const onChangePPD = (e) => {
    const ppdId = e.target.value
    setPPD(ppdId)
    setPPK("")
    dispatch(getppk(ppdId))

    checkFormChange(formData, "")
  }

  const onChangePPK = (e) => {
    const orgId = e.target.value
    setPPK(orgId)
    dispatch(getPositions(orgId))

    checkFormChange(formData, orgId)
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const newPosition = positionsList?.data.find(
      (position) => position.type === user.currentPosition.type,
    )

    const userData = {
      grade,
      currentPositionId: user.currentPosition.positionId,
      newPositionId: newPosition
        ? Number(newPosition.id)
        : user.currentPosition.positionId,
    }

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

export default EditProfileByAdmin
