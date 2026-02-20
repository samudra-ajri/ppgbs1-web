import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  Select,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Card,
  CardContent,
  Fab,
  IconButton,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import {
  getGroupTargets,
  reset,
  deleteMaterialTargets,
} from "../features/materialTargets/materialTargetSlice"
import gradeEnum from "../enums/gradeEnum"

function MaterialTarget() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { groupTargets, isLoading, isError, message } = useSelector(
    (state) => state.materialTargets,
  )
  const { user } = useSelector((state) => state.auth)

  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTarget, setSelectedTarget] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    dispatch(getGroupTargets({ month, year }))

    return () => {
      dispatch(reset())
    }
  }, [dispatch])

  const handleView = () => {
    dispatch(getGroupTargets({ month, year }))
  }

  const handleMenuOpen = (event, target) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedTarget(target)
  }

  const handleMenuClose = (event) => {
    if (event) event.stopPropagation()
    setAnchorEl(null)
  }

  const handleDeleteClick = (event) => {
    event.stopPropagation()
    handleMenuClose()
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
    setSelectedTarget(null)
  }

  const handleConfirmDelete = () => {
    if (selectedTarget) {
      const grades = selectedTarget.grades.join(",")
      dispatch(deleteMaterialTargets({ grades, month, year })).then(() => {
        dispatch(getGroupTargets({ month, year }))
      })
      handleDialogClose()
    }
  }

  return (
    <Container sx={{ mt: 3, mb: 10 }}>
      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Target Materi Bulanan
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }} alignItems='center'>
        <Grid item xs={4}>
          <FormControl fullWidth size='small'>
            <InputLabel id='month-label' htmlFor='month-input'>
              Bulan
            </InputLabel>
            <Select
              labelId='month-label'
              id='month-select'
              name='month'
              inputProps={{ id: "month-input" }}
              value={month}
              label='Bulan'
              onChange={(e) => setMonth(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <TextField
            id='year'
            name='year'
            fullWidth
            label='Tahun'
            type='number'
            value={year}
            onChange={(e) => setYear(e.target.value)}
            size='small'
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant='contained'
            fullWidth
            onClick={handleView}
            disabled={isLoading}
          >
            Lihat
          </Button>
        </Grid>
      </Grid>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color='error' align='center'>
          {message}
        </Typography>
      ) : (
        <Box>
          {groupTargets &&
            groupTargets.map((item, index) => {
              const gradesValue = typeof item === "object" ? item.grades : item
              const grades = gradesValue
                .map((grade) => gradeEnum[grade])
                .join(", ")

              return (
                <Card
                  variant='outlined'
                  sx={{ mb: 0.5, cursor: "pointer", position: "relative" }}
                  key={item.id || item._id || index}
                  onClick={() =>
                    navigate("/c/material-target/detail", {
                      state: {
                        month,
                        year,
                        grades: gradesValue,
                        total: item.total,
                      },
                    })
                  }
                >
                  {user?.currentPosition?.type === "ADMIN" && (
                    <IconButton
                      aria-label='settings'
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      onClick={(e) =>
                        handleMenuOpen(e, {
                          ...item,
                          grades: gradesValue,
                        })
                      }
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )}
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Grid
                      container
                      alignItems='center'
                      justifyContent='space-between'
                    >
                      <Grid item xs={12}>
                        <Typography variant='body2' color='textSecondary'>
                          Rombongan Belajar
                        </Typography>
                        <Typography variant='body1'>{grades}</Typography>
                        <Box
                          sx={{
                            display: "inline-block",
                            bgcolor: item.total > 0 ? "#2E7D32" : "#BDBDBD",
                            color: "#fff",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            mt: 1,
                          }}
                        >
                          <Typography variant='caption' fontWeight='bold'>
                            Total {item.total} target
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )
            })}

          {(!groupTargets ||
            (Array.isArray(groupTargets) && groupTargets.length === 0)) && (
            <Typography align='center' sx={{ mt: 2 }}>
              Belum ada target dibuat.
            </Typography>
          )}
        </Box>
      )}

      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleDeleteClick}>Hapus</MenuItem>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{"Hapus Target?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Apakah Anda yakin ingin menghapus target materi ini? Tindakan ini
            tidak dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Batal</Button>
          <Button onClick={handleConfirmDelete} autoFocus color='error'>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {user?.currentPosition?.type === "ADMIN" && (
        <Fab
          size='large'
          color='info'
          aria-label='create material target'
          onClick={() => navigate("/c/material-target/create")}
          sx={{ position: "fixed", bottom: 76, right: 16 }}
        >
          <AddRoundedIcon fontSize='large' />
        </Fab>
      )}
    </Container>
  )
}

export default MaterialTarget
