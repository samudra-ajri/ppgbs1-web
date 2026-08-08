import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Box, Button, CircularProgress, Grid, Stack, Typography } from "@mui/material"
import moment from "moment"
import capitalize from "capitalize"
import { toast } from "react-toastify"
import ProfileMenuCard from "../components/ProfileMenuCard"
import PopDialog from "../components/PopDialog"
import { addMyGenerusPosition, logout, reset } from "../features/auth/authSlice"
import ProfileCard from "../components/ProfileCard"

function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isLoading } = useSelector((state) => state.auth)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [isGenerusAdded, setIsGenerusAdded] = useState(false)

  useEffect(() => {
    if (!user) navigate("/login")
    dispatch(reset())
  }, [user, navigate, dispatch])

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate("/")
  }

  const generusCard = () =>
    user.currentPosition.type === "GENERUS" && (
      <>
        <ProfileMenuCard title='Biodata' link='/c/edit-profile' />
        <ProfileMenuCard title='Kelas' link='/c/edit-grade' />
      </>
    )

  const pengajarCard = () =>
    user.currentPosition.type === "PENGAJAR" && (
      <>
        <ProfileMenuCard title='Biodata' link='/c/edit-profile' />
        <ProfileMenuCard title='Kemuballighan' link='/c/edit-kemuballighan' />
      </>
    )

  const isPengajar = user.currentPosition.type === "PENGAJAR"
  const isUnderThirtyOne =
    Boolean(user.birthdate) && moment().diff(user.birthdate, "years") <= 30
  const isSingle = user.maritalStatus === "SINGLE"
  const isNotGenerus =
    !isGenerusAdded &&
    !user.positions.some((position) => position.type === "GENERUS")

  const kelompokName = capitalize
    .words(user.currentPosition.organizationName ?? "")
    .replace(/^Ppk /i, "")

  const onConfirmAlsoGenerus = async () => {
    const result = await dispatch(addMyGenerusPosition())
    setOpenConfirm(false)
    if (addMyGenerusPosition.rejected.match(result)) {
      toast.error(result.payload)
      return
    }
    setIsGenerusAdded(true)
    setOpenSuccess(true)
  }

  const alsoGenerusButton = () =>
    isPengajar &&
    isUnderThirtyOne &&
    isSingle &&
    isNotGenerus && (
      <Button
        fullWidth
        variant='outlined'
        sx={{ mb: 2, py: 1.5, textTransform: "none" }}
        onClick={() => setOpenConfirm(true)}
      >
        Saya adalah Pengajar sekaligus Generus
      </Button>
    )

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Profile
      </Typography>
      <ProfileCard user={user} />
      {generusCard()}
      {pengajarCard()}
      <ProfileMenuCard title='Ubah Password' link='/c/update-password' />
      {alsoGenerusButton()}
      <Typography
        mt={5}
        align='center'
        variant='subtitle1'
        color='red'
        style={{ cursor: "pointer", fontWeight: "bold" }}
        onClick={onLogout}
      >
        Logout
      </Typography>

      <PopDialog
        title={
          <>
            Saya konfirmasi bahwa saya adalah{" "}
            <b>pengajar dan generus</b> di Klp {kelompokName}
          </>
        }
        openPopup={openConfirm}
      >
        <Box sx={{ display: "flex", justifyContent: "center", height: 45 }}>
          {isLoading ? (
            <Grid align='center' sx={{ pt: 1.5 }}>
              <CircularProgress size={20} />
            </Grid>
          ) : (
            <Stack spacing={1} direction='row'>
              <Button variant='contained' onClick={onConfirmAlsoGenerus}>
                Ya
              </Button>
              <Button variant='outlined' onClick={() => setOpenConfirm(false)}>
                Batal
              </Button>
            </Stack>
          )}
        </Box>
      </PopDialog>

      <PopDialog
        title={
          <>
            Data berhasil diperbarui,
            <br />
            silakan lakukan login ulang.
          </>
        }
        openPopup={openSuccess}
      >
        <Box sx={{ display: "flex", justifyContent: "center", height: 45 }}>
          <Button variant='contained' onClick={() => setOpenSuccess(false)}>
            OK
          </Button>
        </Box>
      </PopDialog>
    </>
  )
}

export default Profile
