import { Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function RegisterOptions() {
  const navigate = useNavigate()

  return (
    <>
      <Typography align='center' variant="h4">
        Registrasi
      </Typography>

      <Grid>
        <Card variant="" style={{ maxWidth: 650, padding: "0 5px", margin: "0 auto" }}>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Button
                  onClick={() => navigate('/c/register/generus')}
                  size="large"
                  style={{ margin: "10px auto", textTransform: 'none' }}
                  type="submit"
                  variant="contained"
                  color="info"
                  fullWidth
                >Sebagai Generus
                </Button>
                <Button
                  onClick={() => navigate('/c/register/muballigh')}
                  size="large"
                  style={{ margin: "10px auto", textTransform: 'none' }}
                  type="submit"
                  variant="contained"
                  color="info"
                  fullWidth
                >Sebagai Pengajar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default RegisterOptions