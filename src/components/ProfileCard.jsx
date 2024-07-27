import React from "react"
import { Card, CardContent, Chip, CircularProgress, Grid, Typography } from "@mui/material"
import gradeEnum from "../enums/gradeEnum"
import moment from "moment"

function ProfileCard({ user, isLoading }) {
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
                      moment(user?.birthdate).fromNow().split(" ")[0] +
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
                  <Grid item xs={10} md={11}>
                    <Chip
                      size='small'
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
                )}
            </Grid>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default ProfileCard
