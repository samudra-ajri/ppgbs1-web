import {
  Box,
  Card,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import BackHeader from '../components/BackHeader'
import PresenceForm from '../components/PresenceForm'
import PresenceCodeForm from '../components/PresenceCodeForm'
import MonthlyTargetChecklist from '../components/MonthlyTargetChecklist'
import { getEvent, reset } from '../features/event/eventSlice'
import {
  createCompletion,
  createCompletionByAdmin,
} from '../features/updateCompletion/updateCompletionSlice'

const tabStyle = {
  textTransform: 'none',
  borderRadius: '50px',
  border: '1px solid',
  borderColor: 'primary.main',
  minHeight: 'unset',
  padding: '6px 12px',
  fontSize: 12,
  lineHeight: 1.3,
  '&.Mui-selected': {
    bgcolor: 'primary.main',
    color: 'white',
  },
  '&:not(.Mui-selected)': {
    color: 'primary.main',
  },
}

function EventPresence() {
  const eventId = window.location.pathname.split('/')[3]
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { event, isSuccess } = useSelector((state) => state.events)
  const { isPresentStatus } = useSelector((state) => state.presences)
  const [tab, setTab] = useState(0)
  const [noMaterialAdditionReason, setNoMaterialAdditionReason] = useState('')
  const [selectedMaterialIds, setSelectedMaterialIds] = useState([])
  const [presenceError, setPresenceError] = useState('')
  const [checklistKey, setChecklistKey] = useState(0)

  // target materi mengikuti bulan kegiatan, bukan bulan saat halaman dibuka
  const eventDate = event?.data?.startDate
    ? new Date(Number(event.data.startDate))
    : new Date()
  const month = eventDate.getMonth() + 1
  const year = eventDate.getFullYear()
  const hasGrade = user?.grade !== undefined && user?.grade !== null
  const isAlreadyPresent = isPresentStatus?.data.status === 'HADIR'
  // hanya kegiatan yang mewajibkan update capaian yang menampilkan bagian target
  const mustUpdateMaterialFirst = Boolean(event?.data?.mustUpdateMaterialFirst)
  const showTargetSection =
    mustUpdateMaterialFirst && hasGrade && !isAlreadyPresent

  useEffect(() => {
    if (!user) navigate('/login')
    dispatch(getEvent(eventId))
    dispatch(reset())
  }, [user, eventId, navigate, dispatch])

  // pindah tab membatalkan pilihan alasan, jadi tidak terbawa dari kunjungan sebelumnya
  const onChangeTab = (event, newValue) => {
    setTab(newValue)
    setNoMaterialAdditionReason('')
    setSelectedMaterialIds([])
    setPresenceError('')
  }

  const onSelectionChange = useCallback((materialIds) => {
    setSelectedMaterialIds(materialIds)
    if (materialIds.length > 0) setPresenceError('')
  }, [])

  const onChangeNoMaterialAdditionReason = (e) => {
    setNoMaterialAdditionReason(e.target.value)
    setPresenceError('')
  }

  // kehadiran hanya bisa dikirim setelah capaian target diisi atau alasannya dipilih
  const validationError = () => {
    if (!showTargetSection) return ''
    if (tab === 0) {
      if (selectedMaterialIds.length > 0) return ''
      return '(!) Silakan isi capaian target terlebih dahulu. Bila tidak ada penambahan capaian target materi silakan klik tab "Tidak Ada Penambahan Capaian Target" di atas.'
    }
    if (noMaterialAdditionReason) return ''
    return '(!) Silakan pilih penyebab tidak ada penambahan capaian target terlebih dahulu.'
  }

  const validateBeforePresence = () => {
    const error = validationError()
    setPresenceError(error)
    return !error
  }

  // dijalankan setelah kehadiran diterima, jadi kode akses sudah pasti benar
  const onPresenceCreated = async () => {
    if (tab !== 0 || selectedMaterialIds.length === 0) return

    try {
      if (user.currentPosition?.type === 'GENERUS') {
        await dispatch(
          createCompletion({
            data: { materialIds: selectedMaterialIds },
            params: {
              targetMaterialMonth: month,
              targetMaterialYear: year,
              targetGrade: user.grade,
            },
          }),
        ).unwrap()
      } else {
        await dispatch(
          createCompletionByAdmin({
            userId: user.id,
            materialIds: selectedMaterialIds,
          }),
        ).unwrap()
      }
      // muat ulang daftar supaya capaian yang baru tersimpan ikut terkunci
      setChecklistKey((prevState) => prevState + 1)
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <>
      <BackHeader title='Kehadiran' />
      <Typography variant='h6' align='center' sx={{ mb: 3 }}>Isi Daftar Hadir</Typography>
      {isSuccess && <>
        <PresenceForm event={event.data} user={user} />

        {showTargetSection && (
          <Box sx={{ mt: 3 }}>
            <Tabs
              value={tab}
              onChange={onChangeTab}
              variant='fullWidth'
              TabIndicatorProps={{ sx: { display: 'none' } }}
              sx={{
                mb: 3,
                minHeight: 'unset',
                '& .MuiTabs-flexContainer': { gap: 1 },
              }}
            >
              <Tab label='Tambah Capaian Target Saat Ini' sx={tabStyle} />
              <Tab label='Tidak Ada Penambahan Capaian Target' sx={tabStyle} />
            </Tabs>

            {tab === 0 ? (
              <MonthlyTargetChecklist
                key={checklistKey}
                userId={user.id}
                targetGrade={user.grade}
                month={month}
                year={year}
                byAdmin={user.currentPosition?.type !== 'GENERUS'}
                showSummary={false}
                showActions={false}
                lockCompleted
                onSelectionChange={onSelectionChange}
              />
            ) : (
              <Card
                variant='outlined'
                sx={{
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  px: 2,
                  py: 1,
                }}
              >
                <RadioGroup
                  value={noMaterialAdditionReason}
                  onChange={onChangeNoMaterialAdditionReason}
                >
                  <FormControlLabel
                    value='ALREADY_COMPLETED'
                    control={<Radio size='small' />}
                    label='Materi yang disampaikan sudah tercapai sebelumnya'
                    componentsProps={{ typography: { variant: 'body2' } }}
                  />
                  <FormControlLabel
                    value='OUTSIDE_TARGET'
                    control={<Radio size='small' />}
                    label='Materi yang disampaikan diluar target saat ini'
                    componentsProps={{ typography: { variant: 'body2' } }}
                  />
                </RadioGroup>
              </Card>
            )}
          </Box>
        )}

        <Box sx={{ mt: 4, pb: 6 }}>
          <PresenceCodeForm
            event={event.data}
            validate={validateBeforePresence}
            errorMessage={presenceError}
            extraPayload={
              tab === 1 ? { noMaterialAdditionReason } : undefined
            }
            onPresenceCreated={onPresenceCreated}
          />
        </Box>
      </>}
    </>
  )
}

export default EventPresence
