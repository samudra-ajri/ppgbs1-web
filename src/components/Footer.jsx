import { Paper, Typography } from "@mui/material"

function Footer() {
  return (
    <Paper sx={{ position: 'static', bottom: 80, left: 0, right: 0 }} elevation={0}>
      <Typography 
        align="center" 
        sx={{ color:'#76859B', fontSize: 10 }}
      >
        <b>PIGARU</b> | Pusat Informasi Generus Bandung Selatan I
      </Typography>
      </Paper>
  )
}

export default Footer
