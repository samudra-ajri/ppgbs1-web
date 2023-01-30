import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material"
import capitalize from "capitalize"
import { Link } from "react-router-dom"

function PeopleCardResetPassword(props) {
  const { user } = props

  return (
    <>
      <Card sx={{ mb: 0.5, cursor: "pointer" }}>
        <CardContent
          sx={{
            padding: 2,
            "&:last-child": {
              paddingBottom: 2,
            },
          }}
        >
          <Grid container>
            <Grid item xs={10} md={11}>
              <Link to={`/c/reset-passwords/${user.name.toLowerCase().split(' ').join('-')}/${user.resetPasswordToken}`} component={CardActionArea}>
                <Grid container>
                  <Grid item>
                    <Typography variant='body2'>{user.name}</Typography>
                  </Grid>
                </Grid>
                <Typography fontSize={10} component='p' color='text.secondary'>
                  {capitalize.words(user.ds + ", " + user.klp)}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default PeopleCardResetPassword
