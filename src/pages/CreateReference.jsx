import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { createReference, reset } from "../features/references/referenceSlice"
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import BackHeader from "../components/BackHeader"

function CreateReference() {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
  })

  const { name, url, description } = formData
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const { isLoadingCreate, isErrorCreate, isSuccessCreate, message } =
    useSelector((state) => state.references)

  useEffect(() => {
    if (!user) navigate("/login")
    if (user?.role === "GENERUS") navigate("/user-completion")
    if (isErrorCreate) toast.error(message)
    if (isSuccessCreate) {
      toast.success("berhasil.")
      navigate("/references")
    }
    dispatch(reset())
  }, [user, isErrorCreate, isSuccessCreate, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const data = { name, url, description }
    dispatch(createReference(data))
  }

  return (
    <>
      <BackHeader title='Kegiatan' />

      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Tambah Pustaka
      </Typography>

      <Grid>
        <Card
          variant=''
          style={{ maxWidth: 650, padding: "0 5px", margin: "0 auto" }}
        >
          {isLoadingCreate ? (
            <Grid align='center' sx={{ pt: 5 }}>
              <CircularProgress />
            </Grid>
          ) : (
            <CardContent>
              <form onSubmit={onSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name='name'
                      label='Judul'
                      placeholder='cth: Buku panduan BK'
                      value={name}
                      onChange={onChange}
                      variant='outlined'
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name='url'
                      label='Link'
                      placeholder='cth: https://drive.google.com/file'
                      value={url}
                      onChange={onChange}
                      variant='outlined'
                      fullWidth
                      required
                      multiline
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name='description'
                      label='Deskripsi'
                      placeholder='Deskripsi singkat'
                      value={description}
                      onChange={onChange}
                      variant='outlined'
                      fullWidth
                      multiline
                      rows={4}
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
                    >
                      Tambah
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          )}
        </Card>
      </Grid>
    </>
  )
}

export default CreateReference
