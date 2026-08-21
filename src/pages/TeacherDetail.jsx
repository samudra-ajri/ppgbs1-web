import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material"
import moment from "moment"
import capitalize from "capitalize"
import BackHeader from "../components/BackHeader"
import ProfileCard from "../components/ProfileCard"
import ProfileMenuCard from "../components/ProfileMenuCard"
import { getUserById } from "../features/persons/personSlice"
import haditsOptions from "../constants/haditsOptions"
import scopeOptions from "../constants/scopeOptions"
import maritalStatusOptions from "../constants/maritalStatusOptions"
import muballighStatusOptions from "../constants/muballighStatusOptions"

const EMPTY = "-"

const labelOf = (options, value, key = "value", label = "label") => {
  const found = options.find((option) => option[key] === value)
  return found ? found[label] : value || EMPTY
}

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return EMPTY
  return value
}

const formatMonthYear = (unixSeconds) => {
  if (!unixSeconds) return EMPTY
  return capitalize.words(moment.unix(Number(unixSeconds)).format("MMM YYYY"))
}

const formatOrgName = (name) =>
  capitalize.words(name ?? "").replace(/Ppk /g, "PPK ")

function DetailRow({ label, value }) {
  return (
    <Grid container spacing={1} sx={{ py: 0.75 }}>
      <Grid item xs={5}>
        <Typography variant='body2' color='text.secondary'>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Typography variant='body2' align='right'>
          {value}
        </Typography>
      </Grid>
    </Grid>
  )
}

function DetailCard({ title, children }) {
  return (
    <Card
      variant='outlined'
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <CardContent sx={{ padding: 2, "&:last-child": { paddingBottom: 2 } }}>
        <Typography variant='body1' fontWeight='bold' sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Divider sx={{ mb: 1 }} />
        {children}
      </CardContent>
    </Card>
  )
}

function ChipRow({ label, values, options }) {
  return (
    <Box sx={{ py: 0.75 }}>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 0.75 }}>
        {label}
      </Typography>
      {values?.length ? (
        <Stack direction='row' spacing={0.75} useFlexGap flexWrap='wrap'>
          {values.map((value) => (
            <Chip
              key={value}
              size='small'
              color='info'
              variant='outlined'
              label={labelOf(options, value, "id", "type")}
            />
          ))}
        </Stack>
      ) : (
        <Typography variant='body2'>{EMPTY}</Typography>
      )}
    </Box>
  )
}

function TeacherDetail() {
  const location = useLocation()
  const userId = location.pathname.split("/")[3]

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { person, isLoading, isError } = useSelector((state) => state.person)

  // `person` bisa berisi sisa data user lain dari localStorage, jadi tunggu
  // sampai data yang dimuat benar-benar milik userId di URL.
  const loadedPerson =
    person && String(person.id) === String(userId) ? person : null

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    if (userId) dispatch(getUserById(userId))
  }, [user, userId, navigate, dispatch])

  const teacherPositions =
    loadedPerson?.positions?.filter(
      (position) => position.type === "PENGAJAR",
    ) ?? []
  const generusPosition = loadedPerson?.positions?.find(
    (position) => position.type === "GENERUS",
  )
  const isTugasan = loadedPerson?.muballighStatus === "MT"

  const kemuballighanCard = () => (
    <DetailCard title='Kemuballighan'>
      <DetailRow
        label='Status Kemuballighan'
        value={labelOf(muballighStatusOptions, loadedPerson?.muballighStatus)}
      />
      <DetailRow label='Asal Pondok' value={formatValue(loadedPerson?.pondok)} />
      <DetailRow
        label='Tahun Lulus Tes Muballigh'
        value={formatValue(loadedPerson?.kertosonoYear)}
      />
      <DetailRow
        label='Tahun Pertama Tugasan'
        value={formatValue(loadedPerson?.firstDutyYear)}
      />
      <DetailRow
        label='Jumlah Pengalaman Tugasan'
        value={formatValue(loadedPerson?.timesDuties)}
      />
      {isTugasan && (
        <DetailRow
          label='Periode Tugasan Saat Ini'
          value={`${formatMonthYear(
            loadedPerson?.assignmentStartDate,
          )} - ${formatMonthYear(loadedPerson?.assignmentFinishDate)}`}
        />
      )}
      <ChipRow
        label='Hatam Hadits Besar'
        values={loadedPerson?.greatHadiths}
        options={haditsOptions}
      />
      <ChipRow
        label='Cakupan Mengajar'
        values={loadedPerson?.scopes}
        options={scopeOptions}
      />
    </DetailCard>
  )

  const personalCard = () => (
    <DetailCard title='Data Pribadi'>
      <DetailRow
        label='Tanggal Lahir'
        value={
          loadedPerson?.birthdate
            ? moment(loadedPerson.birthdate).format("DD MMM YYYY")
            : EMPTY
        }
      />
      <DetailRow
        label='Pendidikan Terakhir'
        value={formatValue(loadedPerson?.education)}
      />
      <DetailRow
        label='Status Pernikahan'
        value={labelOf(maritalStatusOptions, loadedPerson?.maritalStatus)}
      />
      <DetailRow label='Jumlah Anak' value={formatValue(loadedPerson?.children)} />
      <DetailRow label='Maisyah Tambahan' value={formatValue(loadedPerson?.job)} />
      <DetailRow
        label='Memiliki BPJS'
        value={
          loadedPerson?.hasBpjs === null || loadedPerson?.hasBpjs === undefined
            ? EMPTY
            : loadedPerson.hasBpjs
              ? "Ya"
              : "Tidak"
        }
      />
    </DetailCard>
  )

  const positionsCard = () => (
    <DetailCard title='Penugasan'>
      {teacherPositions.length ? (
        teacherPositions.map((position) => (
          <Grid
            key={position.positionId}
            container
            spacing={1}
            alignItems='center'
            sx={{ py: 0.75 }}
          >
            <Grid item xs={8}>
              <Typography variant='body2'>
                {formatOrgName(position.positionName)}
              </Typography>
              {position.ancestorOrgName && (
                <Typography variant='caption' color='text.secondary'>
                  {formatOrgName(position.ancestorOrgName)}
                </Typography>
              )}
            </Grid>
            <Grid item xs={4} align='right'>
              <Chip
                size='small'
                variant='outlined'
                color={position.positionDeletedAt ? "default" : "success"}
                label={
                  position.positionDeletedAt ? "Pindah Sementara" : "Aktif"
                }
                sx={{ height: 18, fontSize: 10 }}
              />
            </Grid>
          </Grid>
        ))
      ) : (
        <Typography variant='body2'>{EMPTY}</Typography>
      )}
    </DetailCard>
  )

  const renderDetail = () => {
    if (!loadedPerson) {
      return (
        <Typography align='center' color='text.secondary' sx={{ mt: 5 }}>
          Data pengajar tidak ditemukan.
        </Typography>
      )
    }

    return (
      <Box pb={10}>
        {kemuballighanCard()}
        {personalCard()}
        {positionsCard()}
        {generusPosition && (
          <ProfileMenuCard
            title='Capaian Materi'
            link='/c/person-completion'
          />
        )}
      </Box>
    )
  }

  const isWaiting = !isError && !loadedPerson

  return (
    <>
      <BackHeader title='Detail Pengajar' />
      <ProfileCard user={loadedPerson} isLoading={isLoading || isWaiting} />

      {isLoading || isWaiting ? (
        <Grid align='center' sx={{ pt: 1.5 }}>
          <CircularProgress size={20} />
        </Grid>
      ) : (
        renderDetail()
      )}
    </>
  )
}

export default TeacherDetail
