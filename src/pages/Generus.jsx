import { Typography } from '@mui/material'
import PeopleCard from '../components/PeopleCard'

function Generus() {
  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Daftar Generus</Typography>
      <PeopleCard />
      <PeopleCard />
    </>
  )
}

export default Generus