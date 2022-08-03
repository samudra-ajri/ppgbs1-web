import { Chip, CircularProgress, Grid, Pagination, Stack, Typography } from '@mui/material'
import capitalize from 'capitalize'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BackHeader from '../components/BackHeader'
import translate from '../helpers/translateHelper'
import { getAllCompletionsSubjectScores } from '../features/targetCompleted/targetCompletedSlice'
import { getSubject } from '../features/subjectDetails/subjectDetailsSlice'
import { getRolesCounter } from '../features/userCounters/userCounterSlice'
import { Box } from '@mui/system'
import chroma from "chroma-js"
import { useState } from 'react'

function CompletedDetails() {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [onClick, setOnClick] = useState('')
	const handleClick = (e) => {
		setOnClick(e.target.innerText)
	}

	const path = window.location.pathname.split('/')
	const params = window.location.search.split('?')[1].split('&')
	const ds = params[0].split('=')[1].replace('-', ' ')
	const klp = params[1].split('=')[1].replace('-', ' ')
	const subjectId = path[4]
  const [page, setPage] = useState(1)
  const chunkSize = 50

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

	const colorScale = chroma.scale(['#f8bbd0', '#2e7d32']);

	const { user } = useSelector((state) => state.auth)
	const { completedTargets } = useSelector((state) => state.completedTargets)
	const { subjectDetails, isLoading: isLoadingSubject } = useSelector((state) => state.subjectDetails)
	const { countList } = useSelector((state) => state.usersCounter)
	const subjectTargets = subjectDetails?.targets || []

	const generusCount = (countList?.countRoles?.find(o => o._id === 'GENERUS'))?.total || 0.0001
	const findCompleteCount = (target) => {
		return (completedTargets?.targetsCompleted?.find(o => o.target === target))?.count || 0
	}

	const style = (target) => {
		const completedCount = findCompleteCount(target)
		const title = path[3]
		const scale = completedCount/generusCount

		let style = { m: 0.5 }
		if (title === 'alquran' || title === 'hadits') style.width = '15%'
		style.backgroundColor = onClick === target ? 'grey' : colorScale(scale).hex()
		style.color = (scale <= 0.1 || onClick === target) ? 'black' : 'white'

		return style
	}

	const handleChange = (event, value) => {
    setPage(value)
  }

	useEffect(() => {
		if (!user) navigate('/login')
		dispatch(getAllCompletionsSubjectScores({ subjectId, ds, klp }))
		dispatch(getSubject(subjectId))
		dispatch(getRolesCounter({ ds, klp }))
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
					subjectTargets.slice(chunkSize*(page-1), chunkSize*page).map((target) => (
						<Chip
							variant='solid'
							key={target}
							sx={style(target)}
							label={<Typography sx={{ fontSize: 10 }}> { target === onClick ? (findCompleteCount(target)/generusCount*100).toFixed(1) + '%' : target } </Typography>}
							name={target}
							onClick={handleClick}
						/>
					))
				)}
			</Box>
			<Pagination
        size='medium'
        count={Math.ceil((subjectDetails?.totalPoin || 0) / chunkSize)}
        onChange={handleChange}
        sx={{
          justifyContent: 'center',
          display: 'flex',
          marginTop: 2
        }}
      />
		</>
	)
}

export default CompletedDetails