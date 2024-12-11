import React from "react"
import {
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material"
import EditIcon from "@mui/icons-material/BorderColorOutlined"
import gradeEnum from "../enums/gradeEnum"
import moment from "moment"
import { useNavigate } from "react-router-dom"

function ProfileCard({ user, isLoading }) {
  const navigate = useNavigate()

  const handleEditClick = () => {
    navigate("/c/edit-grade")
  }

  const currentPosition =
    user?.currentPosition ||
    user?.positions?.find((position) => position.type === "GENERUS")

  return (
    <>
      {isLoading ? (
        <Grid pb={10}>
          <Card align='center'>
            <CardContent>
              <CircularProgress size='3rem' />
            </CardContent>
          </Card>
        </Grid>
      ) : (
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Grid container justifyContent='center' alignItems='center'>
              <Grid item xs={10} md={11}>
                <Typography align='center'>
                  <b>{user?.name}</b>
                </Typography>

                <Typography align='center' color='text.secondary' fontSize={12}>
                  {user?.phone}
                </Typography>

                <Typography align='center' color='text.secondary' fontSize={12}>
                  {user?.email}
                </Typography>

                <Typography align='center' color='text.secondary' fontSize={12}>
                  {user?.username}
                </Typography>

                <Typography align='center' color='text.secondary' fontSize={12}>
                  {user?.positions[0]?.type !== "ADMIN"
                    ? (user?.sex === 1 ? "Laki-laki" : "Perempuan") +
                      ", " +
                      moment().diff(user?.birthdate, 'years') +
                      " tahun"
                    : ""}
                </Typography>

                {currentPosition && (
                  <Typography
                    align='center'
                    color='text.secondary'
                    fontSize={12}
                    variant='subtitle2'
                  >
                    {currentPosition.positionName}
                  </Typography>
                )}
              </Grid>
              {(user?.grade || user?.grade === 0) &&
                currentPosition.type === "GENERUS" && (
                  <Grid
                    container
                    item
                    xs={12}
                    justifyContent='center'
                    alignItems='center'
                    spacing={1}
                  >
                    <Grid item xs={1}></Grid>
                    <Grid item md={10} xs={8}>
                      <Chip
                        size='medium'
                        label={
                          <Typography variant='caption'>
                            {gradeEnum[user?.grade]}
                          </Typography>
                        }
                        color='success'
                        variant='outlined'
                        sx={{ display: "flex", justifyContent: "center" }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      {user?.currentPosition?.type !== "GENERUS" && (
                        <IconButton onClick={handleEditClick}>
                          <EditIcon fontSize='small' color='inherit' />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                )}
            </Grid>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default ProfileCard
