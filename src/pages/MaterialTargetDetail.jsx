import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material"
import {
  getGroupTargetsSummary,
  getGroupTargetsSummaryMaterial,
  createMaterialTargets,
  deleteMaterialTargets,
  reset,
} from "../features/materialTargets/materialTargetSlice"
import {
  searchMaterials,
  resetMaterials,
} from "../features/materials/materialSlice"
import SumCompletionCard from "../components/SumCompletionCard"
import { logout } from "../features/auth/authSlice"
import { getppd } from "../features/organizations/organizationSlice"
import BackHeader from "../components/BackHeader"
import gradeShortEnum from "../enums/gradeShortEnum"
import PopDialog from "../components/PopDialog"

function MaterialTargetDetail() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDebouncing, setIsDebouncing] = useState(false)
  const [openAddPopup, setOpenAddPopup] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Get state passed from MaterialTarget
  const { month, year, grades } = location.state || {}

  const { user } = useSelector((state) => state.auth)
  const {
    groupTargetsSummary,
    groupTargetsSummaryMaterial,
    isSuccess,
    isError,
    message,
  } = useSelector((state) => state.materialTargets)
  const { materials, isLoading: isLoadingMaterials } = useSelector(
    (state) => state.materials,
  )
  const { ppd: ppdList } = useSelector((state) => state.organizations)

  const isPPG = user?.currentPosition?.organizationLevel === 0
  const isPPDOrTeacher =
    user?.currentPosition?.organizationLevel === 1 ||
    user?.currentPosition?.type === "PENGAJAR"

  const initialAncestorIdFilter = () => {
    const isPPD = user?.currentPosition?.organizationLevel === 1
    if (!isPPDOrTeacher) return ""
    if (isPPD) return user.currentPosition.organizationId
    return user.currentPosition.organizationAncestorId
  }

  // Derive filters from state and user context
  const filters = {
    structure: "category",
    ancestorId: initialAncestorIdFilter(),
    organizationId: "", // Default to empty or handle logic if needed
    usersGrade: grades || [],
    targetType: "monthly",
    month: month || new Date().getMonth() + 1,
    year: year || new Date().getFullYear(),
  }

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    if (isError && message === "Missing authentication.") {
      dispatch(logout())
      navigate("/login")
      return
    }
    if (!ppdList && isPPG) dispatch(getppd())

    // Fetch data
    dispatch(reset())

    // Construct params for getGroupTargetsSummary
    const params = {
      month: filters.month,
      year: filters.year,
      grades:
        filters.usersGrade && filters.usersGrade.length > 0
          ? filters.usersGrade.join(",")
          : null,
    }
    dispatch(getGroupTargetsSummary(params))
  }, [
    isError,
    navigate,
    dispatch,
    message,
    ppdList,
    isPPG,
    month,
    year,
    grades,
  ]) // Add dependencies

  useEffect(() => {
    setIsDebouncing(true)
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 3) {
        dispatch(searchMaterials({ q: searchTerm, page: 1, pageSize: 20 }))
        dispatch(
          getGroupTargetsSummaryMaterial({
            month: filters.month,
            year: filters.year,
            grades:
              filters.usersGrade && filters.usersGrade.length > 0
                ? filters.usersGrade.join(",")
                : null,
            q: searchTerm,
          }),
        )
      } else {
        dispatch(resetMaterials())
      }
      setIsDebouncing(false)
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, dispatch])

  const handleCardClick = (material) => {
    setSelectedMaterial(material)
    setOpenAddPopup(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedMaterial) return

    if (selectedMaterial.targetedCount > 0) {
      const params = {
        materialIds: selectedMaterial.id,
        grades: filters.usersGrade.join(","),
        month: filters.month,
        year: filters.year,
      }
      await dispatch(deleteMaterialTargets(params))
    } else {
      const data = {
        materialIds: [selectedMaterial.id],
        grades: filters.usersGrade,
        month: filters.month,
        year: filters.year,
      }
      await dispatch(createMaterialTargets(data))
    }

    const params = {
      month: filters.month,
      year: filters.year,
      grades:
        filters.usersGrade && filters.usersGrade.length > 0
          ? filters.usersGrade.join(",")
          : null,
    }
    dispatch(getGroupTargetsSummary(params))

    if (searchTerm.length >= 3) {
      dispatch(
        getGroupTargetsSummaryMaterial({
          month: filters.month,
          year: filters.year,
          grades:
            filters.usersGrade && filters.usersGrade.length > 0
              ? filters.usersGrade.join(",")
              : null,
          q: searchTerm,
        }),
      )
    }

    setOpenAddPopup(false)
    setSelectedMaterial(null)
  }

  return (
    <>
      <BackHeader
        capitalizeTitle={false}
        title={`Target ${month}/${year} ${
          grades?.map((grade) => gradeShortEnum[grade]).join(", ") ||
          "Semua Kelas"
        }`}
      />

      {!isSuccess ? (
        <Grid pb={10}>
          <Card align='center'>
            <CardContent>
              <CircularProgress size='3rem' />
            </CardContent>
          </Card>
        </Grid>
      ) : (
        <Container sx={{ mt: 3, mb: 10 }}>
          {groupTargetsSummary?.length === 0 && (
            <Typography align='center' sx={{ mt: 5 }}>
              Target bulan ini belum dibuat.
            </Typography>
          )}

          <TextField
            fullWidth
            label='Cari Materi'
            placeholder='Ketik min. 3 karakter...'
            variant='outlined'
            value={searchTerm}
            size='small'
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 5 }}
          />

          <Box pb={10} pt={groupTargetsSummary?.length > 0 ? 0 : 3}>
            {(() => {
              const groups = []
              const groupMap = new Map()

              if (isLoadingMaterials || isDebouncing) {
                return (
                  <Box display='flex' justifyContent='center' my={5}>
                    <CircularProgress size='2rem' />
                  </Box>
                )
              }

              let filteredSummary = []

              if (searchTerm.length >= 3) {
                filteredSummary = materials.map((m) => {
                  const targetedItem = groupTargetsSummaryMaterial?.find(
                    (t) => t.material === m.material,
                  )
                  const isTargeted = targetedItem
                    ? targetedItem.targetedCount > 0
                    : false

                  return {
                    subject: m.subject || "Lainnya",
                    category: m.material,
                    realCategory: m.category,
                    subcategory: m.subcategory,
                    id: m.id,
                    targetedCount: isTargeted ? 1 : 0, // Using 1 to signal targeted
                    percentage: 0,
                  }
                })
              } else {
                filteredSummary = groupTargetsSummary
              }

              if (filteredSummary?.length === 0 && searchTerm.length >= 3) {
                return (
                  <Typography align='center' sx={{ mt: 2 }}>
                    Tidak ada materi yang ditemukan.
                  </Typography>
                )
              }

              filteredSummary?.forEach((item) => {
                const subject = item.subject || "Lainnya"
                if (!groupMap.has(subject)) {
                  const group = { subject, items: [] }
                  groups.push(group)
                  groupMap.set(subject, group)
                }
                groupMap.get(subject).items.push(item)
              })

              return groups.map((group) => (
                <Box key={group.subject} sx={{ mb: 3 }}>
                  <Typography
                    variant='body1'
                    style={{ fontWeight: "bold" }}
                    sx={{ mb: 1, ml: 1, textTransform: "capitalize" }}
                  >
                    {group.subject.toLowerCase()}
                  </Typography>
                  <Grid container spacing={2}>
                    {group.items.map((sumCompletion, index) => {
                      const queryParams = []
                      // Always monthly target mode here
                      queryParams.push(`targetMaterialMonth=${filters.month}`)
                      queryParams.push(`targetMaterialYear=${filters.year}`)
                      if (filters.usersGrade && filters.usersGrade.length > 0) {
                        queryParams.push(
                          `targetGrade=${filters.usersGrade.join(",")}`,
                        )
                      }

                      const queryString =
                        queryParams.length > 0
                          ? `?${queryParams.join("&")}`
                          : ""

                      // Link to existing GroupCompletionByCategory
                      if (searchTerm.length >= 3) {
                        const isTargeted = sumCompletion.targetedCount > 0
                        const backgroundColor = isTargeted
                          ? "#2E7D32"
                          : undefined
                        const fontColor = isTargeted ? "#F0F6F0" : undefined

                        return (
                          <Grid item xs={6} key={index}>
                            <SumCompletionCard
                              key={index}
                              structure='material'
                              title={
                                <Box>
                                  <Typography
                                    variant='caption'
                                    display='block'
                                    sx={{ opacity: 0.8 }}
                                  >
                                    {sumCompletion.realCategory} -{" "}
                                    {sumCompletion.subcategory}
                                  </Typography>
                                  <div>{sumCompletion.category}</div>
                                </Box>
                              }
                              backgroundColor={backgroundColor}
                              fontColor={fontColor}
                              onClick={() => handleCardClick(sumCompletion)}
                            />
                          </Grid>
                        )
                      }

                      return (
                        <Grid item xs={6} key={index}>
                          <SumCompletionCard
                            key={index}
                            structure='material'
                            totalTarget={sumCompletion.targetedCount}
                            percentage={sumCompletion.percentage}
                            title={sumCompletion.category}
                            link={`/c/material-target/detail/${sumCompletion.category}${queryString}`}
                          />
                        </Grid>
                      )
                    })}
                  </Grid>
                </Box>
              ))
            })()}
          </Box>
        </Container>
      )}

      <PopDialog
        title={
          selectedMaterial?.targetedCount > 0 ? "Hapus Materi" : "Tambah Materi"
        }
        openPopup={openAddPopup}
        setOpenPopup={setOpenAddPopup}
      >
        <Typography variant='body1' sx={{ mb: 2 }}>
          {selectedMaterial?.targetedCount > 0
            ? "Yakin hapus target materi ini untuk rombongan kelas "
            : "Yakin tambah materi ini untuk rombongan kelas "}
          {grades?.map((grade) => gradeShortEnum[grade]).join(", ") ||
            "Semua Kelas"}
          ?
        </Typography>
        <Grid container spacing={2} justifyContent='flex-end'>
          <Grid item>
            <Button
              variant='contained'
              color='error'
              onClick={() => setOpenAddPopup(false)}
            >
              Batal
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              color='primary'
              onClick={handleConfirmAction}
            >
              Ya
            </Button>
          </Grid>
        </Grid>
      </PopDialog>
    </>
  )
}

export default MaterialTargetDetail
