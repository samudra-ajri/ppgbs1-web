import { Card, CardContent, Chip, Grid, Typography } from "@mui/material"
import gradeEnum from "../enums/gradeEnum"

function ProfileCard(props) {
  const user = props.user

  return (
    <>
      <Card sx={{ marginBottom: 2, justifyItems: "center" }}>
        <CardContent>
          <Grid container>
            <Grid item xs={10} md={11}>
              <Typography>{user?.name}</Typography>
              <Typography variant='caption'>
                {user?.currentPosition?.positionName ||
                  user?.positions?.find(
                    (position) => position.type === "GENERUS"
                  )?.positionName}
              </Typography>
            </Grid>
            <Grid item xs={10} md={11} pt={1}>
              <Chip
                size='small'
                label={
                  <Typography variant='caption'>
                    {gradeEnum[user?.grade]}
                  </Typography>
                }
                color='success'
                variant='outlined'
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default ProfileCard
