import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  Switch,
  Chip,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/DeleteOutlineRounded"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import HowToRegIcon from "@mui/icons-material/HowToRegOutlined"
import SchoolIcon from "@mui/icons-material/SchoolOutlined"
import NoSchoolIcon from "@mui/icons-material/PersonRemoveOutlined"
import moment from "moment"
import { Link } from "react-router-dom"
import capitalize from "capitalize"
import { toast } from "react-toastify"
import PopDialog from "./PopDialog"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  addUserPosition,
  deleteUser,
  deleteUserPermanently,
  removeUserPosition,
} from "../features/users/userSlice"
import { getUserById } from "../features/persons/personSlice"
import gradeShortEnum from "../enums/gradeShortEnum"

const formatOrgName = (name) =>
  capitalize.words(name ?? "").replace("Ppk ", "PPK ")

function PeopleCard(props) {
  const dispatch = useDispatch()
  const { user, canDelete, link } = props
  const age = moment().diff(user.birthdate, "years")
  const [openPopup, setOpenPopup] = useState(false)
  const [openTeacherPopup, setOpenTeacherPopup] = useState(false)
  const [openRemoveTeacherPopup, setOpenRemoveTeacherPopup] = useState(false)
  const { isLoading } = useSelector((state) => state.users)

  // `positions` only holds the positions matching the list filter, so role checks
  // use `allPositions` which the list endpoint returns unfiltered.
  const activePositions = (user.allPositions ?? user.positions).filter(
    (position) => !position.positionDeletedAt,
  )
  const teacherPosition = activePositions.find(
    (position) => position.type === "PENGAJAR",
  )
  const canAddTeacher =
    Boolean(user.positions[0]?.organizationId) && !teacherPosition
  const canRemoveTeacher =
    Boolean(teacherPosition?.organizationId) && activePositions.length > 1

  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)

  const [isActive, setIsActive] = useState(
    !user.positions[0]?.positionDeletedAt,
  )
  useEffect(() => {
    setIsActive(!user.positions[0]?.positionDeletedAt)
  }, [user])

  const handleOpenMenu = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setAnchorEl(e.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const onClick = () => {
    setOpenPopup(true)
  }

  const onClickRemove = () => {
    dispatch(
      deleteUserPermanently({
        userId: user.id,
        positionId: user.positions[0].positionId,
      }),
    )
    setOpenPopup(false)
  }

  const handleClickCard = () => {
    dispatch(getUserById(user.id))
  }

  const handleToggleActive = () => {
    setIsActive(!isActive)
    dispatch(
      deleteUser({ userId: user.id, positionId: user.positions[0].positionId }),
    )
    handleCloseMenu()
  }

  const handleClickDelete = () => {
    handleCloseMenu()
    onClick()
  }

  const handleClickAddTeacher = () => {
    handleCloseMenu()
    setOpenTeacherPopup(true)
  }

  const onClickAddTeacher = async () => {
    const result = await dispatch(
      addUserPosition({
        userId: user.id,
        organizationId: user.positions[0].organizationId,
        type: "PENGAJAR",
      }),
    )
    setOpenTeacherPopup(false)
    if (addUserPosition.rejected.match(result)) {
      toast.error(result.payload)
    } else {
      toast.success(`${user.name} ditambahkan sebagai pengajar.`)
    }
  }

  const handleClickRemoveTeacher = () => {
    handleCloseMenu()
    setOpenRemoveTeacherPopup(true)
  }

  const onClickRemoveTeacher = async () => {
    const result = await dispatch(
      removeUserPosition({
        userId: user.id,
        organizationId: teacherPosition.organizationId,
        type: "PENGAJAR",
      }),
    )
    setOpenRemoveTeacherPopup(false)
    if (removeUserPosition.rejected.match(result)) {
      toast.error(result.payload)
    } else {
      toast.success(`${user.name} dihapus sebagai pengajar.`)
    }
  }

  return (
    <>
      <Card
        variant='outlined'
        sx={{
          mb: 1.5,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transform: "translateY(-2px)",
          },
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <CardActionArea
          component={Link}
          to={link}
          onClick={handleClickCard}
          sx={{ display: "block", flex: 1 }}
        >
          <CardContent
            sx={{
              padding: 2,
              "&:last-child": { paddingBottom: 2 },
            }}
          >
            <Box sx={{ pr: 1 }}>
              <Stack
                direction='row'
                alignItems='center'
                spacing={0.75}
                flexWrap='wrap'
              >
                <Typography
                  variant='subtitle1'
                  fontWeight='bold'
                  lineHeight={1.3}
                >
                  {user.name}
                </Typography>
                <Chip
                  label={isActive ? "Aktif" : "Pindah Sementara"}
                  size='small'
                  color={isActive ? "success" : "default"}
                  variant='outlined'
                  sx={{ height: 18, fontSize: 10 }}
                />
              </Stack>

              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ mt: 0.5, display: "block", lineHeight: 1.5 }}
              >
                {capitalize
                  .words(user.positions[0].positionName)
                  .replace("Ppk ", "PPK ")}
                {user.sex ? " · Lk" : " · Pr"}
                {user.grade || user.grade === 0
                  ? ` · ${gradeShortEnum[user.grade]}`
                  : ""}
                {user.birthdate ? ` · ${age} thn` : ""}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pr: 1,
            position: "relative",
            zIndex: 2,
          }}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <Tooltip title='aksi'>
            <IconButton
              size='small'
              aria-label='aksi user'
              aria-haspopup='true'
              aria-expanded={openMenu ? "true" : undefined}
              onClick={handleOpenMenu}
              sx={{ color: "text.secondary" }}
            >
              <MoreVertIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleToggleActive}>
            <ListItemIcon>
              <HowToRegIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Aktifasi user' />
            <Switch
              checked={isActive}
              size='small'
              color='success'
              sx={{ ml: 1, pointerEvents: "none" }}
              inputProps={{ tabIndex: -1 }}
            />
          </MenuItem>

          {canAddTeacher && (
            <MenuItem onClick={handleClickAddTeacher}>
              <ListItemIcon>
                <SchoolIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Tambah sebagai pengajar' />
            </MenuItem>
          )}

          {canRemoveTeacher && (
            <MenuItem onClick={handleClickRemoveTeacher}>
              <ListItemIcon>
                <NoSchoolIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Hapus sebagai pengajar' />
            </MenuItem>
          )}

          {canDelete && <Divider />}

          {canDelete && (
            <MenuItem onClick={handleClickDelete} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <DeleteIcon fontSize='small' color='error' />
              </ListItemIcon>
              <ListItemText primary='Hapus user' />
            </MenuItem>
          )}
        </Menu>
      </Card>

      <PopDialog
        title={`Yakin hapus permanen ${user.name}?`}
        openPopup={openPopup}
      >
        <Box sx={{ display: "flex", justifyContent: "center", height: 45 }}>
          {isLoading ? (
            <Grid align='center' sx={{ pt: 1.5 }}>
              <CircularProgress size={20} />
            </Grid>
          ) : (
            <Stack spacing={1} direction='row'>
              <Button variant='outlined' color='error' onClick={onClickRemove}>
                Hapus
              </Button>
              <Button variant='contained' onClick={() => setOpenPopup(false)}>
                Batal
              </Button>
            </Stack>
          )}
        </Box>
      </PopDialog>

      <PopDialog
        title={
          <>
            Tambahkan {user.name}
            <br />
            sebagai pengajar {formatOrgName(user.positions[0]?.organizationName)}
            ?
          </>
        }
        openPopup={openTeacherPopup}
      >
        <Box sx={{ display: "flex", justifyContent: "center", height: 45 }}>
          {isLoading ? (
            <Grid align='center' sx={{ pt: 1.5 }}>
              <CircularProgress size={20} />
            </Grid>
          ) : (
            <Stack spacing={1} direction='row'>
              <Button variant='contained' onClick={onClickAddTeacher}>
                Tambah
              </Button>
              <Button
                variant='outlined'
                onClick={() => setOpenTeacherPopup(false)}
              >
                Batal
              </Button>
            </Stack>
          )}
        </Box>
      </PopDialog>

      <PopDialog
        title={
          <>
            Hapus {user.name}
            <br />
            sebagai pengajar {formatOrgName(teacherPosition?.organizationName)}?
          </>
        }
        openPopup={openRemoveTeacherPopup}
      >
        <Box sx={{ display: "flex", justifyContent: "center", height: 45 }}>
          {isLoading ? (
            <Grid align='center' sx={{ pt: 1.5 }}>
              <CircularProgress size={20} />
            </Grid>
          ) : (
            <Stack spacing={1} direction='row'>
              <Button
                variant='outlined'
                color='error'
                onClick={onClickRemoveTeacher}
              >
                Hapus
              </Button>
              <Button
                variant='contained'
                onClick={() => setOpenRemoveTeacherPopup(false)}
              >
                Batal
              </Button>
            </Stack>
          )}
        </Box>
      </PopDialog>
    </>
  )
}

export default PeopleCard
