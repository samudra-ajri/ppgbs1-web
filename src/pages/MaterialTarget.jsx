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
  CardActionArea,
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
  duplicateMaterialTargets,
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

  const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false)
  const [duplicateMonth, setDuplicateMonth] = useState(() => {
    const today = new Date()
    return today.getMonth() + 2 > 12 ? 1 : today.getMonth() + 2
  })
  const [duplicateYear, setDuplicateYear] = useState(() => {
    const today = new Date()
    return today.getMonth() + 2 > 12
      ? today.getFullYear() + 1
      : today.getFullYear()
  })

  useEffect(() => {
    dispatch(getGroupTargets({ month, year }))

    return () => {
      dispatch(reset())
    }
  }, [dispatch, month, year])

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

  const handleDuplicateClick = (event) => {
    event.stopPropagation()
    handleMenuClose()
    setOpenDuplicateDialog(true)
  }

  const handleDuplicateDialogClose = () => {
    setOpenDuplicateDialog(false)
    setSelectedTarget(null)
  }

  const handleConfirmDuplicate = () => {
    if (selectedTarget) {
      const payload = {
        grades: selectedTarget.grades,
        fromMonth: month,
        fromYear: year,
        toMonth: duplicateMonth,
        toYear: duplicateYear,
      }
      dispatch(duplicateMaterialTargets(payload)).then(() => {
        if (duplicateMonth === month && duplicateYear === year) {
          dispatch(getGroupTargets({ month, year }))
        }
      })
      handleDuplicateDialogClose()
    }
  }

  return (
    <Container sx={{ mt: 3, mb: 10 }}>
      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Target Materi Bulanan
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }} alignItems='center'>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
                  sx={{
                    mb: 1.5,
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transform: "translateY(-2px)",
                    },
                    position: "relative",
                  }}
                  key={item.id || item._id || index}
                >
                  <CardActionArea
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
                    sx={{ display: "block", height: "100%" }}
                  >
                    <CardContent
                      sx={{
                        padding: 2.5,
                        "&:last-child": { paddingBottom: 2.5 },
                      }}
                    >
                      <Box sx={{ pr: 4 }}>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            fontWeight: 500,
                          }}
                        >
                          Rombongan Belajar
                        </Typography>

                        <Typography
                          variant='subtitle1'
                          fontWeight='bold'
                          lineHeight={1.3}
                          sx={{ mb: 1.5, mt: 0.5 }}
                        >
                          {grades}
                        </Typography>

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
                      </Box>
                    </CardContent>
                  </CardActionArea>

                  {user?.currentPosition?.type === "ADMIN" && (
                    <IconButton
                      aria-label='settings'
                      size='small'
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 1,
                        color: "text.secondary",
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        handleMenuOpen(e, {
                          ...item,
                          grades: gradesValue,
                        })
                      }}
                    >
                      <MoreVertIcon fontSize='small' />
                    </IconButton>
                  )}
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
        <MenuItem onClick={handleDuplicateClick}>Duplikasi</MenuItem>
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

      <Dialog
        open={openDuplicateDialog}
        onClose={handleDuplicateDialogClose}
        aria-labelledby='duplicate-dialog-title'
        aria-describedby='duplicate-dialog-description'
      >
        <DialogTitle id='duplicate-dialog-title'>
          {"Duplikasi Target"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='duplicate-dialog-description'>
            Duplikasi target ini ke bulan lain.
          </DialogContentText>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='dup-month-label'>Bulan</InputLabel>
                <Select
                  labelId='dup-month-label'
                  value={duplicateMonth}
                  label='Bulan'
                  onChange={(e) => setDuplicateMonth(e.target.value)}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Tahun'
                type='number'
                size='small'
                value={duplicateYear}
                onChange={(e) => setDuplicateYear(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDuplicateDialogClose}>Batal</Button>
          <Button onClick={handleConfirmDuplicate} autoFocus>
            Duplikasi
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
