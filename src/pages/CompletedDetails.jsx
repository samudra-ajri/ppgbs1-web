import { Chip, Grid, Stack, Typography } from '@mui/material'
import capitalize from 'capitalize'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import CircularProgressWithLabel from '../components/CircularProgressWithLabel'
import { getSubject, reset } from '../features/subjectDetails/subjectDetailsSlice'

function CompletedDetails() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const path = window.location.pathname.split('/')
	const title = path[3]

  const { user } = useSelector((state) => state.auth)

	useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getSubject())
    dispatch(reset())
  }, [user, navigate, dispatch])

	return (
		<>
			<BackHeader title='Detail Capaian' />
			<Typography sx={{ mb: 1 }} variant="h7" component="div">Materi {capitalize(title)}</Typography>
			<Stack direction="row" spacing={0.5}>
				<Chip
					variant={'solid'}
					label={<Typography sx={{ fontSize: 10 }}>Ds: Margahayu</Typography>}
					color='info'
				/>
				<Chip
					variant={'solid'}
					label={<Typography sx={{ fontSize: 10 }}>Klp: Margahayu Utara</Typography>}
					color='info'
				/>
			</Stack>
			<Grid container align='center' spacing={1}>
        <CircularProgressWithLabel value={10} title='Total' isloading={'true'} sizePosition='top' link='#'/>
        <CircularProgressWithLabel value={30} title='Alquran' isloading={'true'} link='/c/targets-completed/alquran'/>
        <CircularProgressWithLabel value={60} title='Alhadits' isloading={'true'} link='/c/targets-completed/hadits' />
        <CircularProgressWithLabel value={70} title='Penunjang' isloading={'true'} link='/c/targets-completed/extra' />
        <CircularProgressWithLabel value={90} title='Hafalan' isloading={'true'} link='/c/targets-completed/rote' />
      </Grid>
		</>
	)
}

export default CompletedDetails