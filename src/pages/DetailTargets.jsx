import { Typography } from '@mui/material'
import BackHeader from '../components/BackHeader'

function DetailTargets(props) {
  const rawTitle = props.path.split('/')
  const title = rawTitle[rawTitle.length - 1]
  return (
    <>
      <BackHeader title={title}/>
      <Typography align='center' variant='h6' sx={{ mb: 1 }}>Detil Target</Typography>
    </>
  )
}

export default DetailTargets