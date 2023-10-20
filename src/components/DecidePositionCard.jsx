import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material"
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom"
import { decidePosition } from "../features/auth/authSlice"

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}`,
  };
}

function DecidePositionCard(props) {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(decidePosition(position.positionId))
  }

  const { position } = props
  return (
    <Container maxWidth="xs">
      <Card sx={{ mb: 2, cursor: "pointer" }} onClick={handleClick}>
        <CardContent>
          <Grid container>
            <Grid item xs={10} md={11}>
              <Link to={"#"} component={CardActionArea}>
                <Grid container>
                <Grid item paddingRight={2}><Avatar {...stringAvatar(position.type)} /></Grid>
                  <Grid item>
                    <Typography variant='body2'>{position.type}</Typography>
                    <Typography
                      fontSize={10}
                      component='p'
                      color='text.secondary'
                    >
                      {position.organizationName}
                    </Typography>
                  </Grid>
                </Grid>
              </Link>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  )
}

export default DecidePositionCard
