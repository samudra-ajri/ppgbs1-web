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
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/DeleteOutlineRounded"
import { useState } from "react"
import {
  useDispatch,
  useSelector,
} from "react-redux"
import { deleteReference } from "../features/references/referenceSlice"
import PopDialog from "./PopDialog"

function ReferenceCard({ data, canDelete, link }) {
  const dispatch = useDispatch()
  const [openPopup, setOpenPopup] = useState(false)
  const { isLoading } = useSelector((state) => state.references)

  const handleDeleteClick = () => setOpenPopup(true)

  const handleConfirmDelete = () => {
    dispatch(deleteReference(data.id))
    setOpenPopup(false)
  }

  return (
    <>
      <Card variant='outlined' sx={{ mb: 0.5, cursor: "pointer" }}>
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Grid container>
            <Grid item xs={canDelete ? 10 : 12} md={11}>
              <a
                href={link}
                target='_blank'
                rel='noopener noreferrer'
                style={{ textDecoration: "none" }}
              >
                <Box component={CardActionArea} sx={{ p: 1 }}>
                  <Typography variant='body2'>{data.name}</Typography>
                  <Typography fontSize={10} color='text.secondary'>
                    {data.description}
                  </Typography>
                </Box>
              </a>
            </Grid>
            {canDelete && (
              <Grid item xs={2} md={1} display='flex' justifyContent='flex-end'>
                <Tooltip title='Hapus data'>
                  <IconButton onClick={handleDeleteClick}>
                    <DeleteIcon fontSize='medium' color='error' />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <PopDialog
        title={`Hapus ${data.name}?`}
        openPopup={openPopup}
        onClose={() => setOpenPopup(false)}
      >
        <Box sx={{ display: "flex", justifyContent: "center", height: 45 }}>
          {isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <Stack spacing={1} direction='row'>
              <Button
                variant='outlined'
                color='error'
                onClick={handleConfirmDelete}
              >
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

export default ReferenceCard
