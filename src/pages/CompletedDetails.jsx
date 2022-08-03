import { Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import capitalize from 'capitalize'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import translate from '../helpers/translateHelper'
import { getAllCompletionsSubjectScores } from '../features/targetCompleted/targetCompletedSlice'
import { getSubject } from '../features/subjectDetails/subjectDetailsSlice'
import { Box } from '@mui/system'

function CompletedDetails() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const path = window.location.pathname.split('/')
	const params = window.location.search.split('?')[1].split('&')
	const ds = params[0].split('=')[1].replace('-', ' ')
	const klp = params[1].split('=')[1].replace('-', ' ')
	const subjectId = path[4]

	const title = () => {
		if (path[3] !== path[5]) return `${translate(path[3])} ${path[5]}`
		return translate(path[3])
	}

	const align = () => {
		const title = path[3]
		if (
			title === 'alquran' || title === 'hadits'
		) return 'center'
		return 'left'
	}

	const style = () => {
		const title = path[3]
		if (
			title === 'alquran' || title === 'hadits'
		) return { m: 0.5, width: '15%' }
		return { m: 0.5 }
	}

	const { user } = useSelector((state) => state.auth)
	// const { completedTargets } = useSelector((state) => state.completedTargets)
	const { subjectDetails, isLoading: isLoadingSubject } = useSelector((state) => state.subjectDetails)

	const subjectTargets = subjectDetails?.targets || []

	useEffect(() => {
		if (!user) navigate('/login')
		dispatch(getAllCompletionsSubjectScores({ subjectId, ds, klp }))
		dispatch(getSubject(subjectId))
	}, [user, subjectId, ds, klp, navigate, dispatch])

	return (
		<>
			<BackHeader title='Detail Capaian' />
			<Typography sx={{ mb: 1 }} variant="h7" component="div">Materi {capitalize.words(title())}</Typography>
			<Stack direction="row" spacing={0.5}>
				<Chip
					variant={'solid'}
					label={<Typography sx={{ fontSize: 10 }}>Ds: {capitalize.words(ds || 'semuda ds')}</Typography>}
					color='info'
				/>
				<Chip
					variant={'solid'}
					label={<Typography sx={{ fontSize: 10 }}>Klp: {capitalize.words(klp || 'semuda klp')}</Typography>}
					color='info'
				/>
			</Stack>
			<Box textAlign={align()} pt={1}>
				{isLoadingSubject ? (
					<Grid align="center" sx={{ pt: 1.5 }}>
						<CircularProgress size={20} />
					</Grid>) : (
					subjectTargets.map((target) => (
						<Chip
							variant='solid'
							key={target}
							sx={style()}
							label={<Typography sx={{ fontSize: 10 }}> {target} </Typography>}
							name={target}
							color='success'
						/>
					))
				)}
			</Box>
		</>
	)
}

export default CompletedDetails