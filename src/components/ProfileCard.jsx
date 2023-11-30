import { Card, CardContent, Grid, IconButton, Typography } from "@mui/material"
import EditIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined"
import moment from "moment"
import { useNavigate } from "react-router-dom"

function ProfileCard(props) {
  const navigate = useNavigate()

  const user = props.user
  const age = moment(user?.birthdate).fromNow().split(" ")[0]

  const maritalStatus = () => {
    if (user?.isMarried) return "sudah menikah"
    return "lajang"
  }

  const onClick = () => {
    navigate("/profile/edit")
  }

  return (
    <>
      <Card sx={{ marginBottom: 2, justifyItems: "center" }}>
        <CardContent>
          <Grid container>
            <Grid item xs={10} md={11}>
              <Typography variant='h5' component='div'>
                {user?.name}
              </Typography>
              <Typography color='text.secondary'>
                {user?.currentPosition.positionName}
              </Typography>
              <Typography color='text.secondary'></Typography>
              <Typography color='text.secondary'>
                {user?.email && user.email}
              </Typography>
              <Typography variant='body2'>
                {user?.phone && user.phone}
              </Typography>
              <Typography variant='body2'>
                {user?.email && user.email}
              </Typography>
              <Typography variant='body2'>
                {(user?.sex === 1 ? "Laki-laki" : "Perempuan") +
                  `${
                    user?.currentPosition.type === "GENERUS"
                      ? ", " + age + " tahun"
                      : ", " + maritalStatus()
                  }`}
                <br />
              </Typography>
            </Grid>
            <Grid item>
              <IconButton align='right' onClick={onClick}>
                <EditIcon fontSize='medium' />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default ProfileCard
