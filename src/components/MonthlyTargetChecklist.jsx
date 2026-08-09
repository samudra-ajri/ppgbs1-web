import { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material"
import ExpandLessIcon from "@mui/icons-material/ExpandLessRounded"
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreRounded"
import { toast } from "react-toastify"
import LinearProgressWithLabel from "./LinearProgressWithLabel"
import gradeEnum from "../enums/gradeEnum"
import {
  getSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import {
  createCompletion,
  createCompletionByAdmin,
  deleteCompletion,
  deleteCompletionByAdmin,
} from "../features/updateCompletion/updateCompletionSlice"

const isPageNumber = (material) => /^\d+$/.test(material)

function MonthlyTargetChecklist(props) {
  const { userId, targetGrade, month, year, canInput = true, byAdmin } = props
  const dispatch = useDispatch()
  const { sumCompletions, isSuccess, isError, message } = useSelector(
    (state) => state.completionScores,
  )

  const [inputs, setInputs] = useState({})
  const [baseline, setBaseline] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [expandedSections, setExpandedSections] = useState({})

  const fetchTargets = useCallback(() => {
    dispatch(reset())
    dispatch(
      getSumCompletions({
        structure: "material",
        userId,
        targetMaterialMonth: month,
        targetMaterialYear: year,
        targetGrade,
      }),
    )
  }, [dispatch, userId, month, year, targetGrade])

  useEffect(() => {
    fetchTargets()
  }, [fetchTargets])

  useEffect(() => {
    if (!sumCompletions) return
    const completionInputs = sumCompletions.reduce((acc, item) => {
      acc[item.materialId] = item.completionCount ? 1 : 0
      return acc
    }, {})
    setInputs(completionInputs)
    setBaseline(completionInputs)
  }, [sumCompletions])

  const totalPercentage = useMemo(() => {
    const completionCount =
      sumCompletions?.reduce((acc, curr) => acc + curr.completionCount, 0) ?? 0
    const materialCount =
      sumCompletions?.reduce((acc, curr) => acc + curr.materialCount, 0) ?? 0
    if (!materialCount) return 0
    return Number(((completionCount / materialCount) * 100).toFixed(2))
  }, [sumCompletions])

  // subject > (category, subcategory) > materials
  const groups = useMemo(() => {
    const result = []
    const subjectMap = new Map()

    sumCompletions?.forEach((item) => {
      const subject = item.subject || "Lainnya"
      if (!subjectMap.has(subject)) {
        const group = { subject, sections: [], sectionMap: new Map() }
        result.push(group)
        subjectMap.set(subject, group)
      }
      const group = subjectMap.get(subject)
      const sectionKey = `${item.category}||${item.subcategory}`
      if (!group.sectionMap.has(sectionKey)) {
        const section = {
          key: sectionKey,
          category: item.category,
          subcategory: item.subcategory,
          items: [],
        }
        group.sections.push(section)
        group.sectionMap.set(sectionKey, section)
      }
      group.sectionMap.get(sectionKey).items.push(item)
    })

    return result
  }, [sumCompletions])

  const changes = useMemo(() => {
    const added = Object.keys(inputs)
      .filter((materialId) => inputs[materialId] && !baseline[materialId])
      .map(Number)
    const removed = Object.keys(baseline)
      .filter((materialId) => baseline[materialId] && !inputs[materialId])
      .map(Number)
    return { added, removed }
  }, [inputs, baseline])

  const hasChanges = changes.added.length > 0 || changes.removed.length > 0

  const onToggle = (materialId) => {
    if (!canInput) return
    setInputs((prevState) => ({
      ...prevState,
      [materialId]: prevState[materialId] ? 0 : 1,
    }))
  }

  const selectAllInputs = () => {
    setInputs(
      sumCompletions.reduce((acc, item) => {
        acc[item.materialId] = 1
        return acc
      }, {}),
    )
  }

  const resetInputs = () => setInputs(baseline)

  const saveInputs = async () => {
    const { added, removed } = changes
    setIsSaving(true)
    try {
      if (added.length > 0) {
        await (byAdmin
          ? dispatch(
              createCompletionByAdmin({ userId, materialIds: added }),
            ).unwrap()
          : dispatch(
              createCompletion({
                data: { materialIds: added },
                params: {
                  targetMaterialMonth: month,
                  targetMaterialYear: year,
                  targetGrade,
                },
              }),
            ).unwrap())
      }
      if (removed.length > 0) {
        await (byAdmin
          ? dispatch(
              deleteCompletionByAdmin({ userId, materialIds: removed }),
            ).unwrap()
          : dispatch(deleteCompletion({ materialIds: removed })).unwrap())
      }
      toast.success("Hore! Berhasil update.")
      fetchTargets()
    } catch (error) {
      toast.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isError) {
    return (
      <Typography align='center' sx={{ mt: 5 }}>
        {message || "Gagal memuat target materi."}
      </Typography>
    )
  }

  if (!isSuccess) {
    return (
      <Card align='center'>
        <CardContent>
          <CircularProgress size='3rem' />
        </CardContent>
      </Card>
    )
  }

  if (sumCompletions?.length === 0) {
    return (
      <Typography align='center' sx={{ mt: 5 }}>
        Target bulan ini belum dibuat.
      </Typography>
    )
  }

  const sectionLabel = (section) => {
    if (!section.subcategory || section.subcategory === section.category) {
      return section.category
    }
    return `${section.category} · ${section.subcategory}`
  }

  // halaman Al-Quran/Hadits terlalu banyak untuk langsung ditampilkan
  const isPageSection = (section) =>
    section.items.every((item) => isPageNumber(item.material))

  const doneCount = (section) =>
    section.items.filter((item) => inputs[item.materialId]).length

  const toggleSection = (sectionId) =>
    setExpandedSections((prevState) => ({
      ...prevState,
      [sectionId]: !prevState[sectionId],
    }))

  const renderPages = (section) => (
    <Box sx={{ px: 2, pb: 2 }}>
      <Grid container spacing={1}>
        {section.items.map((item) => {
          const checked = Boolean(inputs[item.materialId])
          return (
            <Grid item xs={3} md={2} key={item.materialId}>
              <Box
                onClick={() => onToggle(item.materialId)}
                sx={{
                  py: 1,
                  textAlign: "center",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: checked ? "#2E7D32" : "divider",
                  bgcolor: checked ? "#2E7D32" : "transparent",
                  color: checked ? "#F0F6F0" : "text.primary",
                  cursor: canInput ? "pointer" : "default",
                  userSelect: "none",
                }}
              >
                <Typography variant='body2' fontWeight='bold'>
                  {item.material}
                </Typography>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )

  const renderMaterials = (section) => (
    <List disablePadding>
      {section.items.map((item) => (
        <ListItemButton
          key={item.materialId}
          onClick={() => onToggle(item.materialId)}
          disabled={!canInput}
          sx={{ py: 0.5 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Checkbox
              edge='start'
              color='success'
              checked={Boolean(inputs[item.materialId])}
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          <ListItemText
            primary={item.material}
            secondary={
              item.grade || item.grade === 0
                ? `Kelas: ${gradeEnum[item.grade]}`
                : null
            }
            primaryTypographyProps={{ variant: "body2" }}
            secondaryTypographyProps={{ variant: "caption" }}
          />
        </ListItemButton>
      ))}
    </List>
  )

  return (
    <>
      {/* tetap terlihat saat daftar materi di-scroll, menempel di bawah AppBar */}
      <Box
        sx={{
          position: "sticky",
          top: { xs: 56, sm: 64 },
          zIndex: (theme) => theme.zIndex.appBar - 1,
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
          pt: 1,
          pb: 1.5,
          mb: 2,
        }}
      >
        <Typography variant='body2' style={{ fontWeight: "bold" }} gutterBottom>
          Total
        </Typography>
        <LinearProgressWithLabel value={totalPercentage} />

        {canInput && (
          <Grid container spacing={1} alignItems='center' sx={{ mt: 0 }}>
            <Grid item>
              <Button
                sx={{ fontSize: 11 }}
                variant='contained'
                onClick={selectAllInputs}
              >
                Hatam Semua
              </Button>
            </Grid>
            <Grid item xs style={{ flexGrow: 1 }}></Grid>
            <Grid item>
              <Button
                disabled={!hasChanges || isSaving}
                sx={{ fontSize: 11 }}
                variant='contained'
                onClick={resetInputs}
                color='error'
              >
                Batal
              </Button>
            </Grid>
            <Grid item>
              <Button
                disabled={!hasChanges || isSaving}
                sx={{ fontSize: 11 }}
                variant='contained'
                onClick={saveInputs}
                color='success'
              >
                Simpan
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>

      <Box pb={10}>
        {groups.map((group) => (
          <Box key={group.subject} sx={{ mb: 3 }}>
            <Typography
              variant='body1'
              style={{ fontWeight: "bold" }}
              sx={{ mb: 1, ml: 1, textTransform: "capitalize" }}
            >
              {group.subject.toLowerCase()}
            </Typography>
            <Card
              variant='outlined'
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              {group.sections.map((section, index) => {
                const sectionId = `${group.subject}||${section.key}`
                const collapsible = isPageSection(section)
                const isExpanded = Boolean(expandedSections[sectionId])

                const header = (
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {sectionLabel(section)}
                  </Typography>
                )

                return (
                  <Box key={section.key}>
                    {index > 0 && <Divider />}
                    {collapsible ? (
                      <>
                        <ListItemButton
                          onClick={() => toggleSection(sectionId)}
                          sx={{ px: 2, py: 1.25 }}
                        >
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>{header}</Box>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ mr: 1 }}
                          >
                            {doneCount(section)}/{section.items.length}
                          </Typography>
                          {isExpanded ? (
                            <ExpandLessIcon fontSize='small' color='action' />
                          ) : (
                            <ExpandMoreIcon fontSize='small' color='action' />
                          )}
                        </ListItemButton>
                        <Collapse in={isExpanded} unmountOnExit>
                          {renderPages(section)}
                        </Collapse>
                      </>
                    ) : (
                      <>
                        <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>{header}</Box>
                        {renderMaterials(section)}
                      </>
                    )}
                  </Box>
                )
              })}
            </Card>
          </Box>
        ))}
      </Box>
    </>
  )
}

export default MonthlyTargetChecklist
