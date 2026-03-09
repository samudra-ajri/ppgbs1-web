import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Switch,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/DeleteOutlineRounded"
import moment from "moment"
import { Link } from "react-router-dom"
import capitalize from "capitalize"
import PopDialog from "./PopDialog"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteUser, deleteUserPermanently } from "../features/users/userSlice"
import { getUserById } from "../features/persons/personSlice"
import gradeShortEnum from "../enums/gradeShortEnum"

function PeopleCard(props) {
  const dispatch = useDispatch()
  const { user, canDelete, link } = props
  const age = moment().diff(user.birthdate, "years")
  const [openPopup, setOpenPopup] = useState(false)
  const { isLoading } = useSelector((state) => state.users)

  const [isActive, setIsActive] = useState(
    !user.positions[0]?.positionDeletedAt,
  )
  useEffect(() => {
    setIsActive(!user.positions[0]?.positionDeletedAt)
  }, [user])

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

  const handleSwitchChange = (e) => {
    setIsActive(e.target.checked)
    dispatch(
      deleteUser({ userId: user.id, positionId: user.positions[0].positionId }),
    )
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
        }}
      >
        <CardActionArea
          component={Link}
          to={link}
          onClick={handleClickCard}
          sx={{ display: "block" }}
        >
          <CardContent
            sx={{
              padding: 2,
              "&:last-child": { paddingBottom: 2 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ flex: 1, pr: 2 }}>
                <Typography
                  variant='subtitle1'
                  fontWeight='bold'
                  lineHeight={1.3}
                >
                  {user.name}
                </Typography>

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

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <Tooltip title='aktifasi user'>
                  <Switch
                    checked={isActive}
                    onChange={handleSwitchChange}
                    size='small'
                    color='success'
                  />
                </Tooltip>

                {canDelete && (
                  <Tooltip title='hapus user'>
                    <IconButton
                      size='small'
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onClick()
                      }}
                      sx={{
                        color: "error.main",
                        "&:hover": { backgroundColor: "error.lighter" },
                      }}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
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
    </>
  )
}

export default PeopleCard
