import { Card, CardContent, Grid, IconButton, Typography } from "@mui/material"
import InfoIcon from "@mui/icons-material/InfoOutlined"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

function NeedUpdateCard(props) {
  const navigate = useNavigate()

  const user = props.user
  const { user: loggedUser } = useSelector((state) => state.auth)

  const onClick = () => {
    navigate("/profile/edit")
  }

  return (
    <>
      {user?.ds === "MOVING" ? (
        <Card
          sx={{
            marginBottom: 2,
            justifyItems: "center",
            backgroundColor: "#03a9f4",
          }}
        >
          <CardContent>
            {user._id === loggedUser._id && (
              <Grid container onClick={onClick}>
                <Grid item>
                  <IconButton align='right'>
                    <InfoIcon fontSize='medium' sx={{ color: "white" }} />
                  </IconButton>
                </Grid>

                <Grid item xs={10} md={11}>
                  <Typography sx={{ mt: 1.5 }} variant='body2' color='white'>
                    Selamat bergabung kembali. Silakan edit profil untuk
                    melengkapi data Ds/Klp terlebih dahulu.
                  </Typography>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      ) : (
        <></>
      )}
    </>
  )
}

export default NeedUpdateCard
