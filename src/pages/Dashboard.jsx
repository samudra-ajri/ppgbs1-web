import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Card, Chip, Grid, Typography, Divider } from '@mui/material'
import { getDashboard } from '../features/Dashboards/dashboardSlice'
import { useState } from 'react'
import { listDs, listKlp } from '../helpers/locationHelper'

function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { dashboardData } = useSelector(state => state.dashboard)
  const [filters, setFilters] = useState(user?.role === 'PPG' || user?.role === 'ADMIN' ? { role: 'GENERUS' } : (user?.role !== 'PPK' ? { ds: user?.ds, role: 'GENERUS' } : { klp: user?.klp, role: 'GENERUS' }))
  const [focusDs, setFocusDs] = useState(user?.role === 'PPG' || user?.role === 'ADMIN' ? 'SEMUA DS' : user?.ds)
  const [focusKlp, setFocusKlp] = useState(user?.role !== 'PPK' ? 'SEMUA KLP' : user?.klp)
  const [role, setRole] = useState('GENERUS')

  useEffect(() => {
    if (!user) navigate('/login')
    if (user?.role === 'GENERUS') navigate('/user-completion')
    dispatch(getDashboard(filters))
  }, [user, filters, navigate, dispatch])

  const onClickDs = (e) => {
    delete filters.klp
    if (e.target.innerText === 'SEMUA DS') {
      delete filters.ds
    } else {
      setFilters((prevState) => ({
        ...prevState,
        ds: e.target.innerText
      }))
    }
    dispatch(getDashboard(filters))
    setFocusDs(e.target.innerText)
    setFocusKlp('SEMUA KLP')
  }

  const onClickKlp = (e) => {
    if (e.target.innerText === 'SEMUA KLP') {
      delete filters.klp
      setFilters((prevState) => ({
        ...prevState,
        ds: focusDs
      }))
    } else {
      setFilters((prevState) => ({
        ...prevState,
        klp: e.target.innerText
      }))
    }
    dispatch(getDashboard(filters))
    setFocusKlp(e.target.innerText)
  }

  const handleClick = (e, props) => {
    const filterKey = Object.keys(props)[0]
    const filterValue = Object.values(props)[0]

    if (Object.values(filters).includes(filterValue)) {
      handleClickRemove(filterKey)
    } else {
      setFilters((prevState) => ({
        ...prevState,
        ...props
      }))
    }
  }

  const handleClickRoleFilter = (e, props) => {
    if (e.target.innerText !== role) {
      setRole(e.target.innerText)
      setFilters((prevState) => ({
        ...prevState,
        ...props
      }))
    }
  }

  const handleClickRemove = (props) => {
    const filterKey = props
    if (filterKey === 'role') {
      props = { role: 'MUBALLIGH' }
      setFilters((prevState) => ({
        ...prevState,
        ...props
      }))
    } else {
      delete filters[props]
    }
    dispatch(getDashboard(filters))
  }

  const filterColor = (cardName) => {
    let color = ''
    if (Object.values(filters).includes(cardName)) color = '#EFEFEF'
    return { backgroundColor: color }
  }

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 1 }}>Dashboard</Typography>

      {(user?.role === 'ADMIN' || user?.role === 'PPG') &&
        <Box pb={1}>
          <Typography variant='body2'>Filter Ds</Typography>
          <Chip
            variant={'SEMUA DS' === focusDs ? 'solid' : 'outlined'}
            label={<Typography sx={{ fontSize: 10 }}> SEMUA DS </Typography>}
            name='SEMUA DS'
            color='info'
            sx={{ m: 0.25 }}
            onClick={onClickDs}
          />
          {listDs().map(ds => <Chip
            variant={ds === focusDs ? 'solid' : 'outlined'}
            key={ds}
            label={<Typography sx={{ fontSize: 10 }}> {ds} </Typography>}
            name={ds}
            color='info'
            sx={{ m: 0.25 }}
            onClick={onClickDs}
          />)}
        </Box>
      }
      {((user?.role !== 'PPK') && focusDs !== 'SEMUA DS') &&
        <Box pb={1}>
          <Typography variant='body2'>Filter Klp</Typography>
          <Chip
            variant={'SEMUA KLP' === focusKlp ? 'solid' : 'outlined'}
            label={<Typography sx={{ fontSize: 10 }}> SEMUA KLP </Typography>}
            name='SEMUA KLP'
            color='info'
            sx={{ m: 0.25 }}
            onClick={onClickKlp}
          />
          {(focusDs ? listKlp(focusDs) : []).map(klp => <Chip
            variant={klp === focusKlp ? 'solid' : 'outlined'}
            key={klp}
            label={<Typography sx={{ fontSize: 10 }}> {klp} </Typography>}
            color='info'
            name={klp}
            sx={{ m: 0.25 }}
            onClick={onClickKlp}
          />)}
        </Box>
      }
      <Divider light />
      <Box pt={1} pb={1}>
        <Chip
          variant={role === 'GENERUS' ? 'solid' : 'outlined'}
          label={<Typography sx={{ fontSize: 10 }}>GENERUS</Typography>}
          color='info'
          sx={{ m: 0.25 }}
          onClick={e => { handleClickRoleFilter(e, { role: 'GENERUS' }) }}
        />
        <Chip
          variant={role === 'MUBALLIGH' ? 'solid' : 'outlined'}
          label={<Typography sx={{ fontSize: 10 }}>MUBALLIGH</Typography>}
          color='info'
          sx={{ m: 0.25 }}
          onClick={e => { handleClickRoleFilter(e, { role: 'MUBALLIGH' }) }}
        />
      </Box>

      <Grid container align='center' spacing={1}>
        {role === 'GENERUS' && <>
          <Grid item xs={12}>
            <Card sx={{ padding: 1, justifyItems: 'center' }}>
              <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
                <Typography
                  align='center'
                  variant="h5"
                  color="text.secondary"
                >{dashboardData?.users?.generus || 0}
                </Typography>
                <Typography
                  align='center'
                  variant="body1"
                  color="text.secondary">Generus
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={4}>
            <Card style={filterColor('preteenAge')} onClick={e => { handleClick(e, { age: 'preteenAge' }) }} sx={{ padding: 1, justifyItems: 'center' }}>
              <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
                <Typography
                  align='center'
                  variant="h5"
                  color="text.secondary"
                >{dashboardData?.users?.preteenAge || 0}
                </Typography>
                <Typography
                  align='center'
                  variant="body2"
                  color="text.secondary">Pra Remaja
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={4}>
            <Card style={filterColor('teenAge')} onClick={e => { handleClick(e, { age: 'teenAge' }) }} sx={{ padding: 1, justifyItems: 'center' }}>
              <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
                <Typography
                  align='center'
                  variant="h5"
                  color="text.secondary"
                >{dashboardData?.users?.teenAge || 0}
                </Typography>
                <Typography
                  align='center'
                  variant="body2"
                  color="text.secondary">Remaja
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={4}>
            <Card style={filterColor('premarriedAge')} onClick={e => { handleClick(e, { age: 'premarriedAge' }) }} sx={{ padding: 1, justifyItems: 'center' }}>
              <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
                <Typography
                  align='center'
                  variant="h5"
                  color="text.secondary"
                >{dashboardData?.users?.premarriedAge || 0}
                </Typography>
                <Typography
                  align='center'
                  variant="body2"
                  color="text.secondary">Pra Nikah
                </Typography>
              </Box>
            </Card>
          </Grid>
        </>}

        {role === 'MUBALLIGH' && <>
        <Grid item xs={12}>
            <Card sx={{ padding: 1, justifyItems: 'center' }}>
              <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
                <Typography
                  align='center'
                  variant="h5"
                  color="text.secondary"
                >{dashboardData?.users?.mt + dashboardData?.users?.ms || 0}
                </Typography>
                <Typography
                  align='center'
                  variant="body1"
                  color="text.secondary">Muballigh
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card style={filterColor('MT')} onClick={e => { handleClick(e, { role: 'MT' }) }} sx={{ padding: 1, justifyItems: 'center' }}>
              <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
                <Typography
                  align='center'
                  variant="h5"
                  color="text.secondary"
                >{dashboardData?.users?.mt || 0}
                </Typography>
                <Typography
                  align='center'
                  variant="body1"
                  color="text.secondary">MT
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card style={filterColor('MS')} onClick={e => { handleClick(e, { role: 'MS' }) }} sx={{ padding: 1, justifyItems: 'center' }}>
              <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
                <Typography
                  align='center'
                  variant="h5"
                  color="text.secondary"
                >{dashboardData?.users?.ms || 0}
                </Typography>
                <Typography
                  align='center'
                  variant="body1"
                  color="text.secondary">MS
                </Typography>
              </Box>
            </Card>
          </Grid>
        </>}

        <Grid item xs={6}>
          <Card style={filterColor('male')} onClick={e => { handleClick(e, { sex: 'male' }) }} sx={{ padding: 1, justifyItems: 'center' }}>
            <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
              <Typography
                align='center'
                variant="h5"
                color="text.secondary"
              >{dashboardData?.users?.male || 0}
              </Typography>
              <Typography
                align='center'
                variant="body2"
                color="text.secondary">Laki-Laki
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card style={filterColor('female')} onClick={e => { handleClick(e, { sex: 'female' }) }} sx={{ padding: 1, justifyItems: 'center' }}>
            <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
              <Typography
                align='center'
                variant="h5"
                color="text.secondary"
              >{dashboardData?.users?.female || 0}
              </Typography>
              <Typography
                align='center'
                variant="body2"
                color="text.secondary">Perempuan
              </Typography>
            </Box>
          </Card>
        </Grid>

        {role === 'GENERUS' &&
          <Grid item xs={12}>
            <Card sx={{ padding: 1, justifyItems: 'center' }}>
              <Box marginTop={2.5} marginBottom={2.5} sx={{ position: 'relative' }}>
                <Typography
                  align='center'
                  variant="h4"
                  color="text.secondary"
                >{((dashboardData?.scores?.total || 0) / ((dashboardData?.users?.generus || 0.0001) * 2297) * 100).toFixed(2) + '%'}
                </Typography>
                <Typography
                  align='center'
                  variant="body2"
                  color="text.secondary">Capaian Generus
                </Typography>
              </Box>
            </Card>
          </Grid>
        }
      </Grid>
    </>
  )
}

export default Dashboard