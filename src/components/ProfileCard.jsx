import { Card, CardContent, Grid, Typography } from "@mui/material"

function ProfileCard(props) {
  const user = props.user

  return (
    <>
      <Card sx={{ marginBottom: 2, justifyItems: "center" }}>
        <CardContent>
          <Grid container>
            <Grid item xs={10} md={11}>
              <Typography>
                {user?.name}
              </Typography>
              <Typography variant="caption">
                {user?.currentPosition.positionName}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default ProfileCard
