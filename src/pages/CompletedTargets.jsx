import { Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import capitalize from 'capitalize'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import CircularProgressWithLabel from '../components/CircularProgressWithLabel'
import { getSubjectsByCategory, reset } from '../features/subjects/subjectSlice'
import { getRolesCounter } from '../features/userCounters/userCounterSlice'
import { getAllCompletionsScores, reset as resetScores } from '../features/completionScores/completionScoreSlice'

function CompletedTargets() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const path = window.location.pathname.split('/')
	const params = window.location.search.split('?')[1].split('&')
	const paramDs = params[0].split('=')[1].replace('-', ' ')
	const paramKlp = params[1].split('=')[1].replace('-', ' ')
	const ds = paramDs==='semua ds' ? '' : paramDs
	const klp = paramKlp==='semua klp' ? '' : paramKlp
	const title = path[3]

	const { user } = useSelector((state) => state.auth)
	const { subjects, isLoading } = useSelector((state) => state.subjects)
	const { countList, isLoading: isLoadingUserCounter } = useSelector((state) => state.usersCounter)
	const { completionScores, isLoading: isLoadingScores } = useSelector((state) => state.completionScores)

	useEffect(() => {
		if (!user) navigate('/login')
		dispatch(getSubjectsByCategory(title))
		dispatch(getRolesCounter({ ds, klp }))
		dispatch(getAllCompletionsScores({ ds, klp, field: "subjectName", category: title }))
		dispatch(resetScores())
		dispatch(reset())
	}, [ds, klp, user, title, navigate, dispatch])

	const generusCount = (countList?.countRoles?.find(o => o._id === 'GENERUS'))?.total ?? 100000

	return (
		<>
			<BackHeader title='Detail Capaian' />
			<Typography sx={{ mb: 1 }} variant="h7" component="div">Materi {capitalize.words(title)}</Typography>
			<Stack direction="row" spacing={0.5}>
				<Chip
					variant={'solid'}
					label={<Typography sx={{ fontSize: 10 }}>Ds: {capitalize.words(paramDs)}</Typography>}
					color='info'
				/>
				<Chip
					variant={'solid'}
					label={<Typography sx={{ fontSize: 10 }}>Klp: {capitalize.words(paramKlp)}</Typography>}
					color='info'
				/>
			</Stack>
			{subjects
				? (<Grid container align='center' spacing={1} pt={2}>
					{(subjects?.subjects || []).map(subject => (
						<CircularProgressWithLabel
							key={subject.name}
							value={((completionScores?.totalPoin?.find(o => o._id === subject.name))?.total ?? 0) / (subject.totalPoin * generusCount) * 100}
							title={capitalize.words(subject.name)}
							isloading={isLoading || isLoadingUserCounter || isLoadingScores}
							sizePosition={(subjects?.subjects?.length === 1) ? 'top' : undefined}
							link={`/c/details-completed/${subject._id}`}
						/>
					))}
				</Grid>)
				: (<Grid align='center' sx={{ pt: 1.5 }}>
					<CircularProgress size={20} />
				</Grid>)}

		</>
	)
}

export default CompletedTargets