import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import ProfileCard from "../components/ProfileCard"
import {
  Card,
  CardContent,
  CircularProgress,
  Fab,
  Grid,
  Typography,
  Tabs,
  Tab,
  Box,
  TextField,
  MenuItem,
  Button,
} from "@mui/material"
import {
  downloadCompletionData,
  getSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import SumCompletionCard from "../components/SumCompletionCard"
import LinearProgressWithLabel from "../components/LinearProgressWithLabel"
import { logout } from "../features/auth/authSlice"
import moment from "moment"

function PersonCompletion() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { person, isLoading } = useSelector((state) => state.person)
  const { sumCompletions, isSuccess, isError, message } = useSelector(
    (state) => state.completionScores,
  )

  const totalCompletionCount = sumCompletions?.reduce(
    (acc, curr) => acc + (curr.completionCount || 0),
    0,
  )
  const totalMaterialCount = sumCompletions?.reduce(
    (acc, curr) => acc + (curr.materialCount || 0),
    0,
  )

  const totalPercentage =
    totalMaterialCount > 0
      ? (totalCompletionCount / totalMaterialCount) * 100
      : 0

  const [value, setValue] = useState(0)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleView = () => {
    if (person?.grade) {
      dispatch(reset())
      dispatch(
        getSumCompletions({
          structure: "category",
          userId: person.id,
          targetMaterialMonth: month,
          targetMaterialYear: year,
          targetGrade: person.grade,
        }),
      )
    }
  }

  useEffect(() => {
    if (isError && message === "Missing authentication.") {
      dispatch(logout())
      navigate("/login")
      return
    }
  }, [isError, navigate, dispatch, message])

  useEffect(() => {
    if (!person) return

    if (value === 1) {
      dispatch(reset())
      dispatch(getSumCompletions({ structure: "category", userId: person.id }))
    } else if (value === 0) {
      handleView()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, dispatch, person])

  const lastUpdateTime = () => {
    const lastCompletionUpdate = person?.lastCompletionUpdate
    if (lastCompletionUpdate) {
      const startDateObject = moment(new Date(Number(lastCompletionUpdate)))
      const startDate = startDateObject.format("DD MMM YYYY")
      const startTime = startDateObject.format("HH.mm")
      return `${startDate} pkl. ${startTime}`
    }
    return "-"
  }

  const onClickDownload = () => {
    dispatch(downloadCompletionData({ userId: person.id }))
      .unwrap()
      .then((blob) => {
        // Create a Blob from the response
        const file = new Blob([blob], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })

        // Build a URL from the file
        const fileURL = URL.createObjectURL(file)

        // Create a temp <a> tag to download file
        const link = document.createElement("a")
        link.href = fileURL
        link.setAttribute("download", `capaian-materi-${person.name}.xlsx`) // Name the file
        document.body.appendChild(link)
        link.click()

        // Cleanup
        link.parentNode.removeChild(link)
        URL.revokeObjectURL(fileURL)
      })
      .catch((error) => {
        // Handle error here
        console.error("Error downloading the file: ", error)
      })
  }

  const renderResults = () => {
    if (value === 0 && isSuccess && sumCompletions?.length === 0) {
      return (
        <Typography align='center' sx={{ mt: 5 }}>
          Target bulan ini belum dibuat.
        </Typography>
      )
    }

    if (!isSuccess) {
      return (
        <Grid pb={10}>
          <Card align='center'>
            <CardContent>
              <CircularProgress size='3rem' />
            </CardContent>
          </Card>
        </Grid>
      )
    }

    return (
      <>
        {sumCompletions?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='body2'
              style={{ fontWeight: "bold" }}
              gutterBottom
            >
              Total
            </Typography>
            <LinearProgressWithLabel value={totalPercentage} />
          </Box>
        )}
        <Grid container pb={10} spacing={2}>
          {sumCompletions.map((sumCompletion, index) => {
            const link =
              value === 0
                ? `/c/person-completion/${sumCompletion.category}?targetMaterialMonth=${month}&targetMaterialYear=${year}&targetGrade=${person.grade}`
                : `/c/person-completion/${sumCompletion.category}`

            return (
              <Grid item xs={6} key={index}>
                <SumCompletionCard
                  key={index}
                  percentage={sumCompletion.percentage}
                  title={sumCompletion.category}
                  link={link}
                />
              </Grid>
            )
          })}
        </Grid>

        <Fab
          size='medium'
          color='success'
          aria-label='download excel'
          onClick={onClickDownload}
          sx={{ position: "fixed", bottom: 16, right: 16 }}
        >
          <FileDownloadOutlinedIcon />
        </Fab>
      </>
    )
  }

  return (
    <>
      <ProfileCard user={person} isLoading={isLoading} />

      <Grid container pt={2} pb={2}>
        <Grid item xs={12}>
          <Typography
            align='center'
            color='text.secondary'
            fontSize={12}
            variant='subtitle2'
          >
            Update terakhir pada: {lastUpdateTime()}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          TabIndicatorProps={{ sx: { display: "none" } }}
          sx={{
            minHeight: "unset",
            "& .MuiTabs-flexContainer": {
              gap: 2,
            },
          }}
        >
          <Tab
            label='Target Bulanan'
            sx={{
              textTransform: "none",
              borderRadius: "50px",
              border: "1px solid",
              borderColor: "primary.main",
              minHeight: "unset",
              padding: "6px 12px",
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
              },
              "&:not(.Mui-selected)": {
                color: "primary.main",
              },
            }}
          />
          <Tab
            label='Target Keseluruhan (GGB)'
            sx={{
              textTransform: "none",
              borderRadius: "50px",
              border: "1px solid",
              borderColor: "primary.main",
              minHeight: "unset",
              padding: "6px 12px",
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
              },
              "&:not(.Mui-selected)": {
                color: "primary.main",
              },
            }}
          />
        </Tabs>
      </Box>

      {value === 0 && (
        <Box>
          <Grid container spacing={2} alignItems='center' sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <TextField
                select
                label='Bulan'
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                fullWidth
                size='small'
                variant='outlined'
              >
                {Array.from(Array(12)).map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label='Tahun'
                type='number'
                value={year}
                onChange={(e) => setYear(e.target.value)}
                fullWidth
                size='small'
                variant='outlined'
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                size='medium'
                onClick={handleView}
              >
                Lihat
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {renderResults()}
    </>
  )
}

export default PersonCompletion
