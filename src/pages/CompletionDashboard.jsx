import { Grid, Typography } from '@mui/material'
import CircularProgressWithLabel from '../components/CircularProgressWithLabel'

function CompletionDashboard() {
  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Capaian Materi Generus</Typography>
      <Grid container align='center' spacing={1}>
      <CircularProgressWithLabel value={90} title='Total'/>
      <CircularProgressWithLabel value={30} title='Alquran'/>
      <CircularProgressWithLabel value={65} title='Alhadits'/>
      <CircularProgressWithLabel value={65} title='Penunjang'/>
      <CircularProgressWithLabel value={65} title='Hafalan'/>
      </Grid>
    </>
  )
}

export default CompletionDashboard