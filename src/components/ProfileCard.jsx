import React from "react"
import { Card, CardContent, Chip, Grid, Typography } from "@mui/material"
import gradeEnum from "../enums/gradeEnum"

function ProfileCard({ user }) {
  const currentPosition =
    user?.currentPosition ||
    user?.positions?.find((position) => position.type === "GENERUS")

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Grid container justifyContent='center' alignItems='center'>
          <Grid item xs={10} md={11}>
            <Typography align='center'>{user?.name}</Typography>
            {currentPosition && (
              <Typography align='center' variant='subtitle2'>
                {currentPosition.positionName}
              </Typography>
            )}
          </Grid>
          {user?.grade && currentPosition.type === "GENERUS" && (
            <Grid item xs={10} md={11}>
              <Chip
                size='small'
                label={
                  <Typography variant='caption'>
                    {gradeEnum[user.grade]}
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
  )
}

export default ProfileCard
