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
import { useDispatch, useSelector } from "react-redux"
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
          component='a'
          href={link}
          target='_blank'
          rel='noopener noreferrer'
          sx={{ display: "block", color: "inherit", textDecoration: "none" }}
        >
          <CardContent
            sx={{ padding: 2.5, "&:last-child": { paddingBottom: 2.5 } }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ flex: 1, pr: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 0.5,
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    fontWeight='bold'
                    lineHeight={1.3}
                  >
                    {data.name}
                  </Typography>
                  {data.type === "PRIVATE" && (
                    <Typography
                      variant='caption'
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: "error.lighter",
                        color: "error.main",
                        fontWeight: 600,
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Admin Only
                    </Typography>
                  )}
                </Box>

                {data.description && (
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mt: 1, lineHeight: 1.5 }}
                  >
                    {data.description}
                  </Typography>
                )}
              </Box>

              {canDelete && (
                <Tooltip title='Hapus data'>
                  <IconButton
                    size='small'
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDeleteClick()
                    }}
                    sx={{
                      mt: -0.5,
                      mr: -0.5,
                      color: "error.main",
                      "&:hover": { backgroundColor: "error.lighter" },
                    }}
                  >
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </CardContent>
        </CardActionArea>
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
