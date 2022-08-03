import { Chip, Stack, Typography } from '@mui/material'
import capitalize from 'capitalize'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import translate from '../helpers/translateHelper'

function CompletedDetails() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const path = window.location.pathname.split('/')
	const title = () => {
		if (path[3] !== path[5]) return `${translate(path[3])} ${path[5]}`
		return translate(path[3])
	}

	const { user } = useSelector((state) => state.auth)

	useEffect(() => {
		if (!user) navigate('/login')
	}, [user, navigate, dispatch])

	return (
		<>
			<BackHeader title='Detail Capaian' />
			<Typography sx={{ mb: 1 }} variant="h7" component="div">Materi {capitalize.words(title())}</Typography>
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
			
		</>
	)
}

export default CompletedDetails