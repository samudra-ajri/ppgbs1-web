import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material"
import BarIcon from "@mui/icons-material/InsertChartOutlinedRounded"
import PeopleListIcon from "@mui/icons-material/PersonSearchOutlined"
import EventIcon from "@mui/icons-material/EventRounded"
import RestPasswordIcon from "@mui/icons-material/LockResetRounded"
import QueryStatsIcon from "@mui/icons-material/QueryStatsRounded"
import BookIcon from "@mui/icons-material/BookOutlined"
import AddBarIcon from "@mui/icons-material/AddchartRounded"

function Menu() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user || !user.exp) navigate("/login")
    if (user?.currentPosition?.type === "GENERUS") navigate("/user-completion")
  }, [user, navigate, dispatch])

  if (!user) return null

  const menuItems = [
    {
      to: "/events",
      icon: <EventIcon fontSize='large' color='info' />,
      text: "Kegiatan",
    },
    {
      to: "/users",
      icon: <PeopleListIcon fontSize='large' color='info' />,
      text: "Users",
    },
    {
      to: "/group-completion",
      icon: <BarIcon fontSize='large' color='info' />,
      text: "Capaian Materi",
    },
    {
      to: "/references",
      icon: <BookIcon fontSize='large' color='info' />,
      text: "Pustaka",
    },
    {
      to: "/reset-passwords",
      icon: <RestPasswordIcon fontSize='large' color='info' />,
      text: "Reset Password",
    },
    ...(user?.currentPosition?.organizationId === 1 &&
    user?.currentPosition?.type === "ADMIN"
      ? [
          {
            to: "/material-target",
            icon: <AddBarIcon fontSize='large' color='info' />,
            text: "Buat Target Materi",
          },
        ]
      : []),
    {
      to: "/activities-logs",
      icon: <QueryStatsIcon fontSize='large' color='info' />,
      text: "Dashboard",
    },
  ]

  return (
    <Box sx={{ pb: 6 }}>
      <Typography
        variant='h6'
        align='center'
        sx={{ mb: 4, fontWeight: "bold", color: "text.primary" }}
      >
        Hi, {user?.name}
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2.5}>
          {menuItems.map((item, index) => (
            <Grid item xs={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  backgroundColor: "transparent",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.06)",
                    backgroundColor: "background.paper",
                  },
                }}
              >
                <CardActionArea
                  component={Link}
                  to={item.to}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "inherit",
                    textDecoration: "none",
                    p: 2,
                    borderRadius: 3,
                  }}
                >
                  <Box
                    sx={{
                      mb: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: "scale(1.2)",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    align='center'
                    sx={{
                      fontSize: "12px",
                      fontWeight: 500,
                      lineHeight: 1.2,
                      color: "text.secondary",
                    }}
                  >
                    {item.text}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default Menu
