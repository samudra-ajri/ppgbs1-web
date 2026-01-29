import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Card,
  CardContent,
  CircularProgress,
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
  getSumCompletions,
  reset,
} from "../features/completionScores/completionScoreSlice"
import SumCompletionCard from "../components/SumCompletionCard"
import LinearProgressWithLabel from "../components/LinearProgressWithLabel"
import { logout } from "../features/auth/authSlice"

function UserCompletion() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
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
    if (user?.grade) {
      dispatch(reset())
      dispatch(
        getSumCompletions({
          structure: "category",
          userId: user.id,
          targetMaterialMonth: month,
          targetMaterialYear: year,
          targetGrade: user.grade,
        }),
      )
    }
  }

  useEffect(() => {
    if (!user) navigate("/login")
    if (isError && message === "Missing authentication.") {
      dispatch(logout())
      navigate("/login")
    }
  }, [user, isError, message, navigate, dispatch])

  useEffect(() => {
    if (!user) return

    if (value === 1) {
      dispatch(reset())
      dispatch(getSumCompletions({ structure: "category", userId: user.id }))
    } else if (value === 0) {
      handleView()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, dispatch, user])

  const renderResults = () => {
    if (value === 0 && isSuccess && sumCompletions?.length === 0) {
      return (
        <Typography align='center' sx={{ mt: 5 }}>
          Target bulan ini belum dibuat.
        </Typography>
      )
    }

    return (
      <>
        {!isSuccess ? (
          <Grid pb={10}>
            <Card align='center'>
              <CardContent>
                <CircularProgress size='3rem' />
              </CardContent>
            </Card>
          </Grid>
        ) : (
          <Box>
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
              {sumCompletions &&
                sumCompletions.map((sumCompletion, index) => {
                  const link =
                    value === 0
                      ? `/c/user-completion/${sumCompletion.category}?targetMaterialMonth=${month}&targetMaterialYear=${year}&targetGrade=${user.grade}`
                      : `/c/user-completion/${sumCompletion.category}`
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
          </Box>
        )}
      </>
    )
  }

  return (
    <>
      <Typography variant='h6' align='center' sx={{ mb: 3 }}>
        Capaian Materi
      </Typography>

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
          {renderResults()}
        </Box>
      )}

      {value === 1 && renderResults()}
    </>
  )
}

export default UserCompletion
